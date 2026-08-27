import { WORDS_RAW } from "../data/words.js";
import { HOME_LANGUAGES, t } from "./i18n.js";

(function () {
  "use strict";

  // Column order in data/words.js - keep in sync with that file's header
  // comment and with the keys of HOME_LANGUAGES in js/i18n.js.
  var FIELDS = ["da", "en", "uk"];

  var WORDS = WORDS_RAW.trim()
    .split("\n")
    .map(function (line) {
      var parts = line.split("|");
      var w = {};
      for (var i = 0; i < FIELDS.length; i++) w[FIELDS[i]] = (parts[i] || "").trim();
      return w;
    });

  var KEY = "dansk:v1";
  var MISS_WEIGHT = 3;
  var SWIPE = 80;

  var S = {
    home: null,
    stats: {},
    step: 0,
    dir: "da-home",
    autoSpeak: false,
    totals: { right: 0, wrong: 0 },
  };

  var view = "study";
  var pickerOpen = false;
  var current = null;
  var revealed = false;
  var busy = false;
  var askDa = true;
  var session = { right: 0, wrong: 0 };
  var query = "";
  var filter = "all";
  var voice = null;
  var speechOK = false;
  var unlocked = false;

  var viewEl = document.getElementById("dk-view");

  /* ------------------------------ storage ---------------------------- */

  function hasStore() {
    return typeof window.storage === "object" && window.storage !== null;
  }

  function race(p, ms) {
    return Promise.race([
      p,
      new Promise(function (_, rej) {
        setTimeout(function () {
          rej(new Error("timeout"));
        }, ms);
      }),
    ]);
  }

  function localSet(v) {
    try {
      window.localStorage.setItem(KEY, v);
    } catch (e) {}
  }
  function localGet() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      var payload = JSON.stringify(S);
      localSet(payload);
      if (!hasStore()) return;
      try {
        race(window.storage.set(KEY, payload), 3000)["catch"](function () {});
      } catch (e) {}
    }, 400);
  }

  // Older saves used "da-en"/"en-da" (home language was hardcoded to
  // English); map those onto the generic "da-home"/"home-da" directions.
  function migrateDir(dir) {
    if (dir === "da-en") return "da-home";
    if (dir === "en-da") return "home-da";
    return dir || "da-home";
  }

  function applySaved(d) {
    if (!d) return;
    S.home = d.home && HOME_LANGUAGES[d.home] ? d.home : null;
    S.step = d.step || 0;
    S.dir = migrateDir(d.dir);
    S.autoSpeak = !!d.autoSpeak;
    S.totals = d.totals || { right: 0, wrong: 0 };
    var out = {};
    var src = d.stats || {};
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      var v = src[k] || {};
      out[k] = {
        right: v.right || 0,
        wrong: v.wrong || 0,
        retired: "retired" in v ? !!v.retired : (v.right || 0) > 0,
      };
    }
    S.stats = out;
  }

  function load() {
    return new Promise(function (resolve) {
      var done = false;
      function finish() {
        if (!done) {
          done = true;
          resolve();
        }
      }

      if (!hasStore()) {
        try {
          var raw = localGet();
          if (raw) applySaved(JSON.parse(raw));
        } catch (e) {}
        finish();
        return;
      }

      setTimeout(finish, 1800);
      try {
        race(window.storage.get(KEY), 1500).then(
          function (res) {
            try {
              if (res && res.value) applySaved(JSON.parse(res.value));
              else {
                var raw2 = localGet();
                if (raw2) applySaved(JSON.parse(raw2));
              }
            } catch (e) {}
            finish();
          },
          function () {
            try {
              var raw3 = localGet();
              if (raw3) applySaved(JSON.parse(raw3));
            } catch (e) {}
            finish();
          }
        );
      } catch (e) {
        finish();
      }
    });
  }

  /* ------------------------------ speech ----------------------------- */
  // Pronunciation is always Danish, regardless of home language.

  function pickVoice() {
    try {
      var synth = window.speechSynthesis;
      var all = synth && synth.getVoices ? synth.getVoices() : [];
      if (!all || !all.length) return;
      for (var i = 0; i < all.length; i++) {
        var l = (all[i].lang || "").toLowerCase().replace("_", "-");
        if (l === "da" || l.indexOf("da-") === 0) {
          voice = all[i];
          return;
        }
      }
    } catch (e) {}
  }

  function initSpeech() {
    try {
      var synth = window.speechSynthesis;
      if (!synth || !window.SpeechSynthesisUtterance) return;
      speechOK = true;
      pickVoice();
      // Voice list arrives asynchronously on most mobile browsers.
      if (typeof synth.addEventListener === "function")
        synth.addEventListener("voiceschanged", function () {
          var had = voice;
          pickVoice();
          if (!had && voice && view === "study") renderStudy();
        });
      else
        synth.onvoiceschanged = function () {
          pickVoice();
        };
      setTimeout(pickVoice, 500);
      setTimeout(pickVoice, 1500);
    } catch (e) {
      speechOK = false;
    }
  }

  // iOS and some Android browsers only allow speech that starts from a real
  // tap, so prime the engine on the first touch anywhere in the page.
  function unlockSpeech() {
    if (unlocked || !speechOK) return;
    unlocked = true;
    try {
      pickVoice();
      var u = new window.SpeechSynthesisUtterance(" ");
      u.volume = 0;
      u.lang = "da-DK";
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function speak(text) {
    if (!speechOK || !text) return;
    try {
      unlocked = true;
      if (!voice) pickVoice();
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(text);
      u.lang = "da-DK";
      u.rate = 0.85;
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ----------------------------- scheduler --------------------------- */

  function remaining() {
    return WORDS.filter(function (w) {
      var st = S.stats[w.da];
      return !(st && st.retired);
    });
  }

  function pickNext(exclude) {
    var pool = remaining();
    if (!pool.length) return null;
    if (pool.length > 1 && exclude) {
      var t2 = pool.filter(function (w) {
        return w.da !== exclude;
      });
      if (t2.length) pool = t2;
    }
    var weights = pool.map(function (w) {
      var st = S.stats[w.da];
      return st && st.wrong > 0 ? MISS_WEIGHT : 1;
    });
    var sum = 0;
    for (var i = 0; i < weights.length; i++) sum += weights[i];
    var r = Math.random() * sum;
    for (var j = 0; j < pool.length; j++) {
      r -= weights[j];
      if (r <= 0) return pool[j];
    }
    return pool[pool.length - 1];
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function isTouch() {
    try {
      return window.matchMedia && window.matchMedia("(pointer:coarse)").matches;
    } catch (e) {
      return false;
    }
  }

  function tt(key, vars) {
    return t(S.home, key, vars);
  }

  /* ------------------------------- header ------------------------------ */

  function syncHeader() {
    var nav = document.getElementById("dk-nav");
    var show = !!S.home && !pickerOpen;
    nav.style.display = show ? "" : "none";
    if (!show) return;

    var tabs = document.querySelectorAll(".dk-tab");
    for (var i = 0; i < tabs.length; i++) {
      var dv = tabs[i].getAttribute("data-view");
      tabs[i].textContent = tt("tab" + dv.charAt(0).toUpperCase() + dv.slice(1));
      tabs[i].className = "dk-tab" + (dv === view ? " is-on" : "");
    }

    var langbtn = document.getElementById("dk-langbtn");
    if (langbtn) {
      langbtn.textContent = S.home.toUpperCase();
      langbtn.title = tt("changeLanguage");
    }
  }

  /* ------------------------------- views ----------------------------- */

  function setView(v) {
    if (!S.home || pickerOpen) return;
    view = v;
    render();
  }

  function render() {
    syncHeader();
    if (!S.home || pickerOpen) {
      renderPicker();
      return;
    }
    if (view === "study") renderStudy();
    else if (view === "words") renderWords();
    else renderStats();
  }

  function renderPicker() {
    var firstRun = !S.home;
    var titleHtml, subHtml;
    if (firstRun) {
      titleHtml =
        esc(HOME_LANGUAGES.en.strings.pickerTitle) +
        "<br>" +
        esc(HOME_LANGUAGES.uk.strings.pickerTitle);
      subHtml =
        esc(HOME_LANGUAGES.en.strings.pickerSub) +
        " / " +
        esc(HOME_LANGUAGES.uk.strings.pickerSub);
    } else {
      titleHtml = esc(tt("pickerTitle"));
      subHtml = esc(tt("pickerSub"));
    }

    var opts = Object.keys(HOME_LANGUAGES)
      .map(function (code) {
        var L = HOME_LANGUAGES[code];
        return (
          '<button class="dk-picker-opt" data-home="' +
          code +
          '">' +
          esc(L.nativeName) +
          '<span class="dk-picker-native">' +
          esc(L.name) +
          "</span></button>"
        );
      })
      .join("");

    viewEl.innerHTML =
      '<div class="dk-picker">' +
      '<h1 class="dk-picker-title">' +
      titleHtml +
      "</h1>" +
      '<p class="dk-picker-sub">' +
      subHtml +
      "</p>" +
      '<div class="dk-picker-opts">' +
      opts +
      "</div>" +
      (!firstRun
        ? '<button class="dk-picker-cancel" id="dk-picker-cancel">' +
          esc(tt("pickerCancel")) +
          "</button>"
        : "") +
      "</div>";

    var optBtns = viewEl.querySelectorAll(".dk-picker-opt");
    for (var i = 0; i < optBtns.length; i++)
      optBtns[i].onclick = (function (code) {
        return function () {
          S.home = code;
          pickerOpen = false;
          revealed = false;
          save();
          render();
        };
      })(optBtns[i].getAttribute("data-home"));

    var cancel = document.getElementById("dk-picker-cancel");
    if (cancel)
      cancel.onclick = function () {
        pickerOpen = false;
        render();
      };
  }

  function renderStudy() {
    if (!current) current = pickNext(null);
    if (!current) {
      viewEl.innerHTML =
        '<div class="dk-done"><div class="dk-donenum">' +
        WORDS.length +
        '</div><p class="dk-donetext">' +
        esc(tt("doneText")) +
        "</p></div>";
      return;
    }
    var left = remaining().length;
    viewEl.innerHTML =
      '<div class="dk-stage">' +
      '<div class="dk-meter"><span>' +
      esc(tt("leftOf", { left: left, total: WORDS.length })) +
      '</span><span class="dk-meter-sep"></span><span>' +
      esc(tt("scoreLine", { right: session.right, wrong: session.wrong })) +
      "</span></div>" +
      '<div class="dk-deck"><div class="dk-stack">' +
      '<div class="dk-shadow dk-shadow-2"></div>' +
      '<div class="dk-shadow dk-shadow-1"></div>' +
      '<div id="dk-card" class="dk-card is-in"></div>' +
      "</div></div>" +
      '<div id="dk-controls" class="dk-controls"></div>' +
      '<p id="dk-swipehint" class="dk-swipehint"></p>' +
      '<div class="dk-settings">' +
      '<div class="dk-seg-ctl">' +
      dirBtn("da-home", "DA → " + S.home.toUpperCase()) +
      dirBtn("home-da", S.home.toUpperCase() + " → DA") +
      dirBtn("mixed", tt("dirMixed")) +
      "</div>" +
      (speechOK
        ? '<button id="dk-auto" class="dk-toggle' +
          (S.autoSpeak ? " is-on" : "") +
          '"><span class="dk-dot"></span>' +
          esc(tt("readAloud")) +
          "</button>"
        : "") +
      "</div>" +
      (!speechOK
        ? '<p class="dk-note">' + esc(tt("noSpeech")) + "</p>"
        : !voice
        ? '<p class="dk-note">' + esc(tt("noDanishVoice")) + "</p>"
        : "") +
      "</div>";

    var seg = document.querySelectorAll(".dk-segbtn");
    for (var i = 0; i < seg.length; i++)
      seg[i].onclick = (function (v) {
        return function () {
          S.dir = v;
          revealed = false;
          save();
          renderStudy();
        };
      })(seg[i].getAttribute("data-dir"));

    var auto = document.getElementById("dk-auto");
    if (auto)
      auto.onclick = function () {
        S.autoSpeak = !S.autoSpeak;
        unlockSpeech();
        save();
        renderStudy();
        if (S.autoSpeak && current) speak(current.da);
      };

    paintCard();
  }

  function dirBtn(v, label) {
    return (
      '<button class="dk-segbtn' +
      (S.dir === v ? " is-on" : "") +
      '" data-dir="' +
      v +
      '">' +
      esc(label) +
      "</button>"
    );
  }

  function paintCard() {
    if (S.dir === "da-home") askDa = true;
    else if (S.dir === "home-da") askDa = false;

    var card = document.getElementById("dk-card");
    if (!card || !current) return;

    var promptTxt = askDa ? current.da : current[S.home];
    var answerTxt = askDa ? current[S.home] : current.da;
    var st = S.stats[current.da];
    var misses = st ? Math.min(st.wrong, 6) : 0;

    var spine = "";
    for (var i = 0; i < 6; i++)
      spine += '<span class="dk-seg' + (i < misses ? " is-miss" : "") + '"></span>';

    var speakBtn =
      '<button class="dk-speak" data-speak="1">' + spkIcon() + " " + esc(tt("listen")) + "</button>";

    var html =
      '<div class="dk-verdict v-yes" id="dk-vy">' + esc(tt("knewIt")) + "</div>" +
      '<div class="dk-verdict v-no" id="dk-vn">' + esc(tt("didntKnow")) + "</div>" +
      '<div class="dk-spine">' +
      spine +
      "</div>" +
      '<div class="dk-cardbody">' +
      '<div class="dk-lang">' +
      esc(askDa ? tt("danishLabel") : tt("homeLangLabel")) +
      "</div>" +
      '<p class="dk-word' +
      (promptTxt.length > 14 ? " long" : "") +
      '">' +
      esc(promptTxt) +
      "</p>" +
      (askDa && speechOK ? speakBtn : "");

    if (revealed) {
      html +=
        '<div class="dk-rule"></div><div class="dk-lang">' +
        esc(askDa ? tt("homeLangLabel") : tt("danishLabel")) +
        '</div><p class="dk-word dk-word-b' +
        (answerTxt.length > 14 ? " long" : "") +
        '">' +
        esc(answerTxt) +
        "</p>" +
        (!askDa && speechOK ? speakBtn : "");
    }
    html += "</div>";

    card.innerHTML = html;
    card.className = "dk-card is-in" + (revealed ? " is-live" : "");
    card.style.transform = "";
    card.style.opacity = "";
    card.style.transition = "";
    card.style.touchAction = revealed ? "none" : "pan-y";

    var sp = card.querySelectorAll("[data-speak]");
    for (var k = 0; k < sp.length; k++) {
      sp[k].onpointerdown = function (e) {
        e.stopPropagation();
      };
      sp[k].onclick = function (e) {
        e.stopPropagation();
        speak(current.da);
      };
    }

    attachDrag(card);
    paintControls();

    if (S.autoSpeak) {
      if (askDa && !revealed) speak(current.da);
      else if (!askDa && revealed) speak(current.da);
    }
  }

  function spkIcon() {
    return (
      '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
      '<path d="M7 2.5 3.8 5.2H1.5v5.6h2.3L7 13.5v-11Z" fill="currentColor"/>' +
      '<path d="M10.2 5.4a3.4 3.4 0 0 1 0 5.2M12.4 3.4a6.4 6.4 0 0 1 0 9.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
    );
  }

  function paintControls() {
    var c = document.getElementById("dk-controls");
    var hint = document.getElementById("dk-swipehint");
    if (!c) return;
    if (!revealed) {
      c.innerHTML =
        '<button class="dk-reveal" id="dk-rev">' +
        esc(tt("showTranslation")) +
        '<span class="dk-hint">' +
        esc(tt("hintUpDown")) +
        "</span></button>";
      document.getElementById("dk-rev").onclick = doReveal;
      if (hint) hint.textContent = isTouch() ? tt("tapReveal") : tt("tapOrArrows");
    } else {
      c.innerHTML =
        '<div class="dk-choices">' +
        '<button class="dk-choice dk-no" id="dk-bn">' +
        esc(tt("didntKnow")) +
        '<span class="dk-hint">' +
        esc(tt("hintLeft")) +
        "</span></button>" +
        '<button class="dk-choice dk-yes" id="dk-by">' +
        esc(tt("knewIt")) +
        '<span class="dk-hint">' +
        esc(tt("hintRight")) +
        "</span></button>" +
        "</div>";
      document.getElementById("dk-bn").onclick = function () {
        answer(false);
      };
      document.getElementById("dk-by").onclick = function () {
        answer(true);
      };
      if (hint) hint.textContent = tt("swipeHint");
    }
  }

  function doReveal() {
    if (revealed || busy) return;
    revealed = true;
    paintCard();
  }

  /* ------------------------------ answering -------------------------- */

  function answer(knew) {
    if (busy || !current) return;
    busy = true;
    var da = current.da;
    var prev = S.stats[da] || { right: 0, wrong: 0, retired: false };
    S.stats[da] = {
      right: prev.right + (knew ? 1 : 0),
      wrong: prev.wrong + (knew ? 0 : 1),
      retired: knew,
    };
    S.step++;
    S.totals.right += knew ? 1 : 0;
    S.totals.wrong += knew ? 0 : 1;
    session.right += knew ? 1 : 0;
    session.wrong += knew ? 0 : 1;
    save();

    var card = document.getElementById("dk-card");
    if (card) {
      card.className = "dk-card";
      card.style.transition =
        "transform .3s cubic-bezier(.4,0,.9,.4), opacity .3s ease-in";
      card.style.transform =
        "translateX(" + (knew ? 110 : -110) + "%) rotate(" + (knew ? 10 : -10) + "deg)";
      card.style.opacity = "0";
    }

    setTimeout(function () {
      current = pickNext(da);
      revealed = false;
      if (S.dir === "mixed") askDa = Math.random() < 0.5;
      busy = false;
      renderStudy();
    }, 300);
  }

  /* -------------------------------- drag ----------------------------- */

  function attachDrag(card) {
    var st = { x0: 0, y0: 0, moved: 0, active: false, id: null };

    card.onpointerdown = function (e) {
      if (busy) return;
      st = {
        x0: e.clientX,
        y0: e.clientY,
        moved: 0,
        active: true,
        id: e.pointerId,
      };
      card.className = "dk-card" + (revealed ? " is-live" : "");
      card.style.transition = "none";
      try {
        card.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    card.onpointermove = function (e) {
      if (!st.active || e.pointerId !== st.id) return;
      var mx = e.clientX - st.x0;
      var my = e.clientY - st.y0;
      var d = Math.sqrt(mx * mx + my * my);
      if (d > st.moved) st.moved = d;
      if (!revealed) return;
      card.style.transform =
        "translateX(" + mx + "px) rotate(" + mx * 0.045 + "deg)";
      var amt = Math.min(Math.abs(mx) / SWIPE, 1);
      var vy = document.getElementById("dk-vy");
      var vn = document.getElementById("dk-vn");
      if (vy) vy.style.opacity = mx > 0 ? amt : 0;
      if (vn) vn.style.opacity = mx < 0 ? amt : 0;
    };

    function end(e) {
      if (!st.active) return;
      st.active = false;
      try {
        card.releasePointerCapture(st.id);
      } catch (err) {}

      if (!revealed) {
        if (st.moved < 10) doReveal();
        return;
      }
      var mx = e.clientX - st.x0;
      if (Math.abs(mx) > SWIPE) {
        answer(mx > 0);
        return;
      }
      card.style.transition = "transform .25s cubic-bezier(.2,.9,.3,1)";
      card.style.transform = "translateX(0) rotate(0deg)";
      var vy = document.getElementById("dk-vy");
      var vn = document.getElementById("dk-vn");
      if (vy) vy.style.opacity = 0;
      if (vn) vn.style.opacity = 0;
    }
    card.onpointerup = end;
    card.onpointercancel = end;
  }

  /* ------------------------------- browse ---------------------------- */

  function renderWords() {
    var q = query.trim().toLowerCase();
    var hits = WORDS.filter(function (w) {
      if (
        q &&
        w.da.toLowerCase().indexOf(q) < 0 &&
        w[S.home].toLowerCase().indexOf(q) < 0
      )
        return false;
      var st = S.stats[w.da];
      if (filter === "unseen") return !st;
      if (filter === "missed") return st && !st.retired && st.wrong > 0;
      if (filter === "retired") return st && st.retired;
      return true;
    });
    var rows = hits.slice(0, 150);

    var chips = [
      ["all", tt("chipAll")],
      ["unseen", tt("chipUnseen")],
      ["missed", tt("chipMissed")],
      ["retired", tt("chipRetired")],
    ]
      .map(function (c) {
        return (
          '<button class="dk-chip' +
          (filter === c[0] ? " is-on" : "") +
          '" data-f="' +
          c[0] +
          '">' +
          esc(c[1]) +
          "</button>"
        );
      })
      .join("");

    var list = rows.length
      ? '<ul class="dk-list">' +
        rows
          .map(function (w) {
            var st = S.stats[w.da];
            var right;
            if (st && st.retired)
              right = '<span class="dk-badge">' + esc(tt("retiredBadge")) + "</span>";
            else {
              var pips = "";
              for (var i = 0; i < 4; i++)
                pips +=
                  '<span class="dk-pip' +
                  (st && i < st.wrong ? " is-miss" : "") +
                  '"></span>';
              right = '<span class="dk-pips">' + pips + "</span>";
            }
            return (
              '<li class="dk-item"><button class="dk-itemwords" data-say="' +
              esc(w.da) +
              '"><span class="dk-itemda">' +
              esc(w.da) +
              '</span><span class="dk-itemen">' +
              esc(w[S.home]) +
              "</span></button>" +
              right +
              "</li>"
            );
          })
          .join("") +
        "</ul>"
      : '<p class="dk-empty">' + esc(tt("emptyWords")) + "</p>";

    viewEl.innerHTML =
      '<div class="dk-panelwrap">' +
      '<input class="dk-search" id="dk-q" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="' +
      esc(tt("searchPlaceholder")) +
      '" value="' +
      esc(query) +
      '">' +
      '<div class="dk-chips">' +
      chips +
      "</div>" +
      '<div class="dk-browsecount">' +
      esc(tt("browseCountWords", { n: hits.length })) +
      (hits.length > rows.length ? esc(tt("browseShowingFirst", { n: rows.length })) : "") +
      "</div>" +
      '<div class="dk-panel">' +
      list +
      "</div></div>";

    var qi = document.getElementById("dk-q");
    qi.oninput = function () {
      query = qi.value;
      var pos = qi.selectionStart;
      renderWords();
      var n = document.getElementById("dk-q");
      n.focus();
      try {
        n.setSelectionRange(pos, pos);
      } catch (e) {}
    };
    var ch = document.querySelectorAll(".dk-chip");
    for (var i = 0; i < ch.length; i++)
      ch[i].onclick = (function (f) {
        return function () {
          filter = f;
          renderWords();
        };
      })(ch[i].getAttribute("data-f"));
    var says = document.querySelectorAll("[data-say]");
    for (var j = 0; j < says.length; j++)
      says[j].onclick = (function (t2) {
        return function () {
          speak(t2);
        };
      })(says[j].getAttribute("data-say"));
  }

  /* -------------------------------- stats ---------------------------- */

  function renderStats() {
    var retired = 0,
      missed = 0,
      seen = 0;
    var trouble = [];
    for (var k in S.stats) {
      if (!Object.prototype.hasOwnProperty.call(S.stats, k)) continue;
      var v = S.stats[k];
      seen++;
      if (v.retired) retired++;
      else if (v.wrong > 0) {
        missed++;
        trouble.push({ da: k, wrong: v.wrong });
      }
    }
    trouble.sort(function (a, b) {
      return b.wrong - a.wrong;
    });
    trouble = trouble.slice(0, 15);
    var left = WORDS.length - retired;
    var untouched = WORDS.length - seen;
    var total = S.totals.right + S.totals.wrong;
    var acc = total ? Math.round((S.totals.right / total) * 100) : 0;

    var buckets = [
      [tt("barRetired"), retired, "f-retired"],
      [tt("barMissed"), missed, "f-missed"],
      [tt("barUntouched"), untouched, "f-untouched"],
    ];

    var bars = buckets
      .map(function (b) {
        return (
          '<div class="dk-bar"><div class="dk-barlabel"><span>' +
          esc(b[0]) +
          '</span><span class="dk-num">' +
          b[1] +
          '</span></div><div class="dk-track"><div class="dk-fill ' +
          b[2] +
          '" style="width:' +
          (b[1] / WORDS.length) * 100 +
          '%"></div></div></div>'
        );
      })
      .join("");

    var tlist = trouble.length
      ? '<ul class="dk-list">' +
        trouble
          .map(function (tr) {
            var w = WORDS.filter(function (x) {
              return x.da === tr.da;
            })[0];
            return (
              '<li class="dk-item"><span class="dk-itemwords"><span class="dk-itemda">' +
              esc(tr.da) +
              '</span><span class="dk-itemen">' +
              esc(w ? w[S.home] : "") +
              '</span></span><span class="dk-tally">' +
              esc(tt("tally", { n: tr.wrong })) +
              "</span></li>"
            );
          })
          .join("") +
        "</ul>"
      : '<p class="dk-empty">' + esc(tt("troubleEmpty")) + "</p>";

    viewEl.innerHTML =
      '<div class="dk-panelwrap"><div class="dk-grid">' +
      metric(tt("metricRetiredLabel"), retired, tt("metricRetiredSub", { n: WORDS.length })) +
      metric(tt("metricAccuracyLabel"), acc + "%", tt("metricAccuracySub", { n: total })) +
      metric(tt("metricLeftLabel"), left, tt("metricLeftSub", { n: missed })) +
      "</div>" +
      '<div class="dk-panel"><h2 class="dk-h2">' + esc(tt("pileHeader")) + "</h2>" +
      bars +
      "</div>" +
      '<div class="dk-panel"><h2 class="dk-h2">' + esc(tt("troubleHeader")) + "</h2>" +
      tlist +
      "</div>" +
      '<div class="dk-reset"><button class="dk-resetbtn" id="dk-rs">' +
      esc(tt("resetProgress")) +
      "</button></div>" +
      "</div>";

    document.getElementById("dk-rs").onclick = function () {
      var box = document.querySelector(".dk-reset");
      box.innerHTML =
        '<span class="dk-browsecount">' +
        esc(tt("resetWarning")) +
        '</span><button class="dk-resetbtn danger" id="dk-yes2">' +
        esc(tt("resetYes")) +
        '</button><button class="dk-resetbtn" id="dk-no2">' +
        esc(tt("resetCancel")) +
        "</button>";
      document.getElementById("dk-no2").onclick = renderStats;
      document.getElementById("dk-yes2").onclick = function () {
        S.stats = {};
        S.step = 0;
        S.totals = { right: 0, wrong: 0 };
        session = { right: 0, wrong: 0 };
        current = null;
        revealed = false;
        try {
          window.localStorage.removeItem(KEY);
        } catch (e) {}
        try {
          if (hasStore()) window.storage["delete"](KEY);
        } catch (e) {}
        save();
        setView("study");
      };
    };
  }

  function metric(label, val, sub) {
    return (
      '<div class="dk-metric"><div class="dk-metricval">' +
      esc(val) +
      '</div><div class="dk-metriclabel">' +
      esc(label) +
      '</div><div class="dk-metricsub">' +
      esc(sub) +
      "</div></div>"
    );
  }

  /* ------------------------------ keyboard --------------------------- */

  document.addEventListener("keydown", function (e) {
    if (view !== "study" || !S.home || pickerOpen) return;
    var t2 = e.target;
    if (t2 && (t2.tagName === "INPUT" || t2.tagName === "TEXTAREA")) return;
    var k = e.key;
    if (k === "ArrowUp" || k === "ArrowDown") {
      e.preventDefault();
      doReveal();
    } else if (k === "ArrowLeft") {
      e.preventDefault();
      if (revealed) answer(false);
    } else if (k === "ArrowRight") {
      e.preventDefault();
      if (revealed) answer(true);
    } else if (k && k.toLowerCase() === "s") {
      if (current) speak(current.da);
    }
  });

  /* -------------------------------- boot ----------------------------- */

  var tabs = document.querySelectorAll(".dk-tab");
  for (var i = 0; i < tabs.length; i++)
    tabs[i].onclick = (function (v) {
      return function () {
        setView(v);
      };
    })(tabs[i].getAttribute("data-view"));

  var langbtn = document.getElementById("dk-langbtn");
  if (langbtn)
    langbtn.onclick = function () {
      pickerOpen = true;
      render();
    };

  initSpeech();
  document.addEventListener("pointerdown", unlockSpeech, true);
  document.addEventListener("touchstart", unlockSpeech, true);

  load().then(function () {
    try {
      render();
    } catch (e) {
      viewEl.innerHTML =
        '<div class="dk-done"><div class="dk-donenum">!</div><p class="dk-donetext">Error: ' +
        esc(e && e.message) +
        "</p></div>";
    }
  });
})();
