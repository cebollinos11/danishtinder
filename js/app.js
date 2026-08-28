import { WORDS, HOME_CODES } from "../data/words.js";
import { HOME_LANGUAGES, DEFAULT_HOME, t } from "./i18n/index.js";

(function () {
  "use strict";

  // A home language needs both halves: UI strings in js/i18n/ and a word list
  // in data/. Registering only one of the two is the easy mistake when adding a
  // language, so say so at boot instead of failing quietly in the UI later.
  (function checkLanguages() {
    var ui = Object.keys(HOME_LANGUAGES);
    for (var i = 0; i < ui.length; i++)
      if (HOME_CODES.indexOf(ui[i]) < 0)
        console.warn("[lang] " + ui[i] + " has UI strings but no data/words." + ui[i] + ".js");
    for (var j = 0; j < HOME_CODES.length; j++)
      if (ui.indexOf(HOME_CODES[j]) < 0)
        console.warn("[lang] " + HOME_CODES[j] + " has words but no js/i18n/" + HOME_CODES[j] + ".js");
  })();

  var KEY = "dansk:v1";
  var MISS_WEIGHT = 3;
  var SWIPE = 80;
  var RUN_LEN = 5;
  var MISSION_LEN = 5; // runs per mission

  var S = {
    home: null,
    stats: {},
    step: 0,
    dir: "da-home",
    autoSpeak: false,
    totals: { right: 0, wrong: 0 },
    runStep: 0,
    runRight: 0,
    runWrong: 0,
    runResults: [],
    runWords: [],
    missionRun: 0,
    missionRight: 0,
    missionWrong: 0,
    missionsCompleted: 0,
    xp: 0,
    runXpGain: 0,
    missionXpGain: 0,
  };

  var view = "study";
  var pickerOpen = false;
  var current = null;
  var revealed = false;
  var busy = false;
  var askDa = true;
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
  // Saves from before "runs" existed may also carry the now-removed "mixed"
  // direction - fold that (and anything else unrecognized) onto "da-home".
  function migrateDir(dir) {
    if (dir === "da-en") return "da-home";
    if (dir === "en-da") return "home-da";
    if (dir === "da-home" || dir === "home-da") return dir;
    return "da-home";
  }

  function applySaved(d) {
    if (!d) return;
    S.home = d.home && HOME_LANGUAGES[d.home] ? d.home : null;
    S.step = d.step || 0;
    S.dir = migrateDir(d.dir);
    S.autoSpeak = !!d.autoSpeak;
    S.totals = d.totals || { right: 0, wrong: 0 };
    S.runStep = Math.min(Math.max(d.runStep || 0, 0), RUN_LEN);
    S.runRight = d.runRight || 0;
    S.runWrong = d.runWrong || 0;
    S.runResults = Array.isArray(d.runResults) ? d.runResults.slice(0, RUN_LEN) : [];
    S.runWords = Array.isArray(d.runWords) ? d.runWords.slice(0, RUN_LEN) : [];
    S.missionRun = Math.min(Math.max(d.missionRun || 0, 0), MISSION_LEN);
    S.missionRight = d.missionRight || 0;
    S.missionWrong = d.missionWrong || 0;
    S.missionsCompleted = d.missionsCompleted || 0;
    S.xp = d.xp || 0;
    S.runXpGain = d.runXpGain || 0;
    S.missionXpGain = d.missionXpGain || 0;
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
          if (!had && voice && view === "study" && S.home && !pickerOpen)
            renderStudy();
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

  /* -------------------------------- sfx ------------------------------ */
  // Always-on sound effects - no volume/mute control (the OS mute switch
  // covers that). Each clip is cloned per play so overlapping triggers
  // (e.g. quick successive swipes) don't cut each other off; playback is
  // best-effort and silently no-ops where the browser blocks it.

  var SFX_SRC = {
    reveal: "audio/reveal.mp3",
    correct: "audio/correct.mp3",
    wrong: "audio/wrong.mp3",
    runEnd: "audio/run-end.mp3",
    missionEnd: "audio/mission-end.mp3",
  };
  var sfx = {};
  for (var sfxKey in SFX_SRC) {
    if (!Object.prototype.hasOwnProperty.call(SFX_SRC, sfxKey)) continue;
    try {
      sfx[sfxKey] = new Audio(SFX_SRC[sfxKey]);
      sfx[sfxKey].preload = "auto";
    } catch (e) {}
  }

  function playSfx(name, onEnded) {
    var el = sfx[name];
    if (!el) {
      if (onEnded) onEnded();
      return;
    }
    try {
      var node = el.cloneNode(true);
      if (onEnded) node.addEventListener("ended", onEnded, { once: true });
      var p = node.play();
      if (p && p["catch"])
        p["catch"](function () {
          if (onEnded) onEnded();
        });
    } catch (e) {
      if (onEnded) onEnded();
    }
  }

  // Mobile browsers only allow audio playback that originates from a real
  // user gesture, so prime every clip on the first touch/pointer event
  // (mirrors unlockSpeech below) - later programmatic plays (e.g. the
  // run-end sound firing from a setTimeout) then go through cleanly.
  var sfxUnlocked = false;
  function unlockSfx() {
    if (sfxUnlocked) return;
    sfxUnlocked = true;
    for (var k in sfx) {
      if (!Object.prototype.hasOwnProperty.call(sfx, k)) continue;
      try {
        var p = sfx[k].play();
        if (p && p["catch"]) p["catch"](function () {});
        sfx[k].pause();
        sfx[k].currentTime = 0;
      } catch (e) {}
    }
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

  function reducedMotion() {
    try {
      return (
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (e) {
      return false;
    }
  }

  function tt(key, vars) {
    return t(S.home, key, vars);
  }

  /* ------------------------------- header ------------------------------ */

  function closeSettingsMenu() {
    var menu = document.getElementById("dk-settingsmenu");
    var btn = document.getElementById("dk-settingsbtn");
    if (menu) menu.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

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

    var xpBadge = document.getElementById("dk-xpbadge");
    if (xpBadge) {
      xpBadge.title = tt("xpBadgeTitle");
      var xpNum = document.getElementById("dk-xpbadge-num");
      if (xpNum) xpNum.textContent = S.xp;
    }

    var langbtn = document.getElementById("dk-langbtn");
    if (langbtn) {
      langbtn.textContent = S.home.toUpperCase();
      langbtn.title = tt("changeLanguage");
    }

    var settingsBtn = document.getElementById("dk-settingsbtn");
    if (settingsBtn) settingsBtn.title = tt("settingsBtn");
    var nukeBtn = document.getElementById("dk-nukebtn");
    if (nukeBtn) nukeBtn.textContent = tt("nukeProgress");

    closeSettingsMenu();
  }

  /* ------------------------------- views ----------------------------- */

  function setView(v) {
    if (!S.home || pickerOpen) return;
    view = v;
    render();
  }

  function render() {
    // The UI language drives locale-sensitive CSS: text-transform: uppercase
    // maps Turkish "i" to "İ", not "I". Keep <html lang> on the home language,
    // or on the default one while the picker is still up.
    document.documentElement.lang = S.home && !pickerOpen ? S.home : DEFAULT_HOME;
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
    // On first run there's no chosen language yet, so the prompt is shown in
    // the default one. Each option carries its own flag and its name written in
    // that language, which is what a learner actually scans for - so the prompt
    // itself doesn't need to be repeated per language.
    var promptLang = firstRun ? HOME_LANGUAGES[DEFAULT_HOME].strings : null;
    var titleHtml = esc(firstRun ? promptLang.pickerTitle : tt("pickerTitle"));
    var subHtml = esc(firstRun ? promptLang.pickerSub : tt("pickerSub"));

    var opts = Object.keys(HOME_LANGUAGES)
      .map(function (code) {
        var L = HOME_LANGUAGES[code];
        return (
          '<button class="dk-picker-opt" data-home="' +
          code +
          '">' +
          // L.flag is inline SVG authored in js/i18n/<code>.js, i.e. our own
          // markup rather than word data or user input - it goes in raw on
          // purpose. Everything else here still goes through esc().
          '<span class="dk-picker-flag">' +
          (L.flag || "") +
          "</span>" +
          '<span class="dk-picker-name">' +
          esc(L.nativeName) +
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

  function dirLabel(daFirst) {
    return daFirst
      ? tt("danishLabel") + " → " + tt("homeLangLabel")
      : tt("homeLangLabel") + " → " + tt("danishLabel");
  }

  function renderStudy() {
    if (S.runStep >= RUN_LEN) {
      renderRunEnd();
      return;
    }
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
      esc(dirLabel(S.dir === "da-home")) +
      '</span><span class="dk-meter-sep"></span><span>' +
      esc(tt("runOf", { step: S.runStep, total: RUN_LEN })) +
      '</span><span class="dk-meter-sep"></span><span>' +
      esc(tt("scoreLine", { right: S.runRight, wrong: S.runWrong })) +
      "</span></div>" +
      penaltyRow() +
      '<div class="dk-deck"><div class="dk-stack">' +
      '<div class="dk-shadow dk-shadow-2"></div>' +
      '<div class="dk-shadow dk-shadow-1"></div>' +
      '<div id="dk-card" class="dk-card is-in"></div>' +
      "</div></div>" +
      '<div id="dk-controls" class="dk-controls"></div>' +
      '<p id="dk-swipehint" class="dk-swipehint"></p>' +
      '<div class="dk-settings">' +
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

  function penaltyRow() {
    var out = '<div class="dk-penalties">';
    for (var i = 0; i < RUN_LEN; i++) {
      var r = S.runResults[i];
      if (r === true) out += '<span class="dk-pen is-yes" title="' + esc(tt("knewIt")) + '">🇩🇰</span>';
      else if (r === false) out += '<span class="dk-pen is-no" title="' + esc(tt("didntKnow")) + '">💩</span>';
      else out += '<span class="dk-pen is-pending">🇩🇰</span>';
    }
    return out + "</div>";
  }

  function paintCard() {
    askDa = S.dir === "da-home";

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
      (askDa && speechOK ? speakBtn : "") +
      '<div class="dk-answer' +
      (revealed ? "" : " is-blurred") +
      '" id="dk-answer"><div class="dk-rule"></div><div class="dk-lang">' +
      esc(askDa ? tt("homeLangLabel") : tt("danishLabel")) +
      '</div><p class="dk-word dk-word-b' +
      (answerTxt.length > 14 ? " long" : "") +
      '">' +
      esc(answerTxt) +
      "</p>" +
      (!askDa && speechOK ? speakBtn : "") +
      "</div>";
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
    var word = current;
    playSfx("reveal", function () {
      if (S.autoSpeak && !askDa && current === word) speak(word.da);
    });

    var card = document.getElementById("dk-card");
    var ans = document.getElementById("dk-answer");
    if (ans) ans.classList.remove("is-blurred");
    if (card) {
      card.classList.add("is-live");
      card.style.touchAction = "none";
    }
    paintControls();
  }

  /* ------------------------------ answering -------------------------- */

  function answer(knew) {
    if (busy || !current) return;
    busy = true;
    playSfx(knew ? "correct" : "wrong");
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
    S.runStep++;
    S.runRight += knew ? 1 : 0;
    S.runWrong += knew ? 0 : 1;
    S.runResults.push(knew);
    S.runWords.push(da);
    var runJustEnded = S.runStep === RUN_LEN;
    if (runJustEnded) {
      // Run just finished - fold its tally into the mission running total.
      S.missionRun++;
      S.missionRight += S.runRight;
      S.missionWrong += S.runWrong;

      // 1 XP per correct word this run, +1 more for a perfect run. If the
      // mission also wraps up on this run, add its completion bonus - +20
      // base, plus a tier bonus (+10/+20/+30) for hitting 80/90/100% mission
      // accuracy - on top.
      var missionJustCompleted = S.missionRun >= MISSION_LEN;
      var missionXp = 0;
      if (missionJustCompleted) {
        var mTotal = S.missionRight + S.missionWrong;
        var mPct = mTotal ? (S.missionRight / mTotal) * 100 : 0;
        var tierBonus = mPct >= 100 ? 30 : mPct >= 90 ? 20 : mPct >= 80 ? 10 : 0;
        missionXp = 20 + tierBonus;
      }
      S.runXpGain = S.runRight + (S.runWrong === 0 ? 1 : 0);
      S.missionXpGain = missionXp;
      S.xp += S.runXpGain + S.missionXpGain;
    }
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
      if (S.runStep < RUN_LEN) current = pickNext(da);
      revealed = false;
      busy = false;
      renderStudy();
      if (runJustEnded) playSfx(S.missionRun >= MISSION_LEN ? "missionEnd" : "runEnd");
    }, 300);
  }

  // Flips study direction and starts the next run, rolling over into a
  // fresh mission every MISSION_LEN runs.
  function startNextRun() {
    if (S.missionRun >= MISSION_LEN) {
      S.missionsCompleted++;
      S.missionRun = 0;
      S.missionRight = 0;
      S.missionWrong = 0;
    }
    S.dir = S.dir === "da-home" ? "home-da" : "da-home";
    S.runStep = 0;
    S.runRight = 0;
    S.runWrong = 0;
    S.runResults = [];
    S.runWords = [];
    S.runXpGain = 0;
    S.missionXpGain = 0;
    current = pickNext(null);
    revealed = false;
    save();
    renderStudy();
  }

  function missionDots() {
    var out = '<div class="dk-mission-track">';
    for (var i = 0; i < MISSION_LEN; i++)
      out += '<span class="dk-mdot' + (i < S.missionRun ? " is-done" : "") + '">' + (i < S.missionRun ? "🟩" : "⬜") + "</span>";
    return out + "</div>";
  }

  function missedWordsThisRun() {
    var out = [];
    for (var i = 0; i < S.runWords.length; i++) {
      if (S.runResults[i] !== false) continue;
      var da = S.runWords[i];
      var w = null;
      for (var j = 0; j < WORDS.length; j++) {
        if (WORDS[j].da === da) {
          w = WORDS[j];
          break;
        }
      }
      out.push({ da: da, home: w ? w[S.home] : "" });
    }
    return out;
  }

  function statTile(icon, label) {
    return (
      '<div class="dk-runend-stat"><div class="dk-runend-stat-ico">' +
      icon +
      '</div><div class="dk-runend-stat-num">0</div><div class="dk-runend-stat-label">' +
      esc(label) +
      "</div></div>"
    );
  }

  // Counts an element's text up from 0 to `target`, easing out. Skips the
  // animation (and just sets the final value) under prefers-reduced-motion
  // or when there's nothing to count up to.
  function animateCount(el, target, opts) {
    if (!el) return;
    opts = opts || {};
    var suffix = opts.suffix || "";
    var from = opts.from || 0;
    if (reducedMotion() || target === from) {
      el.textContent = target + suffix;
      if (opts.onDone) opts.onDone();
      return;
    }
    var duration = opts.duration || 650;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + eased * (target - from)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else if (opts.onDone) opts.onDone();
    }
    requestAnimationFrame(step);
  }

  // Rolls the header XP badge from its pre-run value up to the new total,
  // fired once the run-end panel's own XP reveal has finished animating.
  function animateHeaderXp(from, to) {
    var el = document.getElementById("dk-xpbadge-num");
    if (!el) return;
    var badge = document.getElementById("dk-xpbadge");
    animateCount(el, to, {
      from: from,
      duration: 700,
      onDone: function () {
        if (!badge || from === to) return;
        badge.classList.add("is-pulsing");
        setTimeout(function () {
          badge.classList.remove("is-pulsing");
        }, 500);
      },
    });
  }

  var CONFETTI_COLORS = ["#235E5A", "#C8102E", "#F2B705", "#3A6EA5", "#16181C"];

  function confettiHtml(count) {
    var out = '<div class="dk-confetti" aria-hidden="true">';
    for (var i = 0; i < count; i++) {
      var left = (Math.random() * 100).toFixed(1);
      var delay = (Math.random() * 0.5).toFixed(2);
      var duration = (1.7 + Math.random() * 1.2).toFixed(2);
      var rotate = Math.round(Math.random() * 70 - 35);
      var color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      out +=
        '<i class="dk-confetti-piece" style="left:' +
        left +
        "%;background:" +
        color +
        ";animation-delay:" +
        delay +
        "s;animation-duration:" +
        duration +
        "s;transform:rotate(" +
        rotate +
        "deg)\"></i>";
    }
    return out + "</div>";
  }

  function renderRunEnd() {
    var total = S.runRight + S.runWrong;
    var pct = total ? Math.round((S.runRight / total) * 100) : 0;
    var daFirst = S.dir === "da-home";
    var missionComplete = S.missionRun >= MISSION_LEN;
    var runsLeft = MISSION_LEN - S.missionRun;
    var missed = missedWordsThisRun();
    var pctClass = pct >= 90 ? " is-great" : pct < 50 ? " is-low" : "";

    var missedHtml = missed.length
      ? '<div class="dk-runend-missed"><div class="dk-runend-missed-title">💥 ' +
        esc(tt("missedThisRun")) +
        '</div><ul class="dk-runend-missed-list">' +
        missed
          .map(function (m) {
            return (
              "<li><span class=\"dk-runend-missed-da\">🇩🇰 " +
              esc(m.da) +
              '</span><span class="dk-runend-missed-home">' +
              esc(m.home) +
              "</span></li>"
            );
          })
          .join("") +
        "</ul></div>"
      : '<div class="dk-runend-perfect">🎉 ' + esc(tt("perfectRunText")) + "</div>";

    viewEl.innerHTML =
      '<div class="dk-runend">' +
      '<div class="dk-runend-dir">' +
      esc(dirLabel(daFirst)) +
      "</div>" +
      '<div class="dk-runend-title">' +
      (missionComplete ? "🏆 " : "🏁 ") +
      esc(missionComplete ? tt("missionCompleteTitle") : tt("runComplete")) +
      "</div>" +
      '<div class="dk-runend-pct' +
      pctClass +
      '" id="dk-runend-pct"><span id="dk-runend-pct-num">0</span>%' +
      (pct === 100 ? '<span class="dk-runend-fire" aria-hidden="true">🔥</span>' : "") +
      "</div>" +
      '<p class="dk-runend-text">' +
      esc(tt("runScoreLine", { right: S.runRight, total: total })) +
      "</p>" +
      '<div class="dk-runend-xp-row">' +
      '<div class="dk-runend-xp" id="dk-runend-xp"><span class="dk-runend-xp-plus">+</span><span class="dk-runend-xp-num" id="dk-runend-xp-num">0</span><span class="dk-runend-xp-label">' +
      esc(tt("xpGainedLabel")) +
      "</span></div>" +
      (missionComplete
        ? '<div class="dk-runend-xp dk-runend-xp-bonus" id="dk-runend-mxp"><span class="dk-runend-xp-plus">+</span><span class="dk-runend-xp-num" id="dk-runend-mxp-num">0</span><span class="dk-runend-xp-label">' +
          esc(tt("missionBonusLabel")) +
          "</span></div>"
        : "") +
      "</div>" +
      missionDots() +
      '<div class="dk-runend-progress">🚀 ' +
      esc(tt("missionProgress", { n: S.missionRun, total: MISSION_LEN })) +
      "</div>" +
      missedHtml +
      '<div class="dk-runend-stats">' +
      statTile("✅", tt("missionCorrectLabel")) +
      statTile("🎯", tt("runsLeftLabel", { n: runsLeft })) +
      "</div>" +
      '<button class="dk-runend-btn' +
      (missionComplete ? " is-complete" : "") +
      '" id="dk-run-continue">' +
      (missionComplete ? "🚀 " : "") +
      esc(missionComplete ? tt("startNextMissionBtn") : tt("runContinueBtn")) +
      '<span class="dk-runend-next">' +
      esc(dirLabel(!daFirst)) +
      "</span></button>" +
      (missionComplete && !reducedMotion() ? confettiHtml(28) : "") +
      "</div>";

    var pctWrap = document.getElementById("dk-runend-pct");
    animateCount(document.getElementById("dk-runend-pct-num"), pct, {
      onDone: function () {
        if (pctWrap) pctWrap.classList.add("is-pulsing");
      },
    });
    var statEls = viewEl.querySelectorAll(".dk-runend-stat-num");
    animateCount(statEls[0], S.missionRight, {
      onDone: function () {
        statEls[0].classList.add("is-pulsing");
      },
    });
    animateCount(statEls[1], runsLeft, {
      onDone: function () {
        statEls[1].classList.add("is-pulsing");
      },
    });

    // XP payout: tally the run's own points first, then (if the mission also
    // wrapped up) the bigger completion bonus, then finally roll the header
    // total up to match - a small cascade so the badge update reads as a
    // consequence of what just happened, not a silent background change.
    var xpBefore = S.xp - S.runXpGain - S.missionXpGain;
    animateCount(document.getElementById("dk-runend-xp-num"), S.runXpGain, {
      onDone: function () {
        var xpEl = document.getElementById("dk-runend-xp");
        if (xpEl && S.runXpGain > 0) xpEl.classList.add("is-pulsing");
        if (missionComplete) {
          animateCount(document.getElementById("dk-runend-mxp-num"), S.missionXpGain, {
            duration: 800,
            onDone: function () {
              var mxpEl = document.getElementById("dk-runend-mxp");
              if (mxpEl) mxpEl.classList.add("is-pulsing");
              animateHeaderXp(xpBefore, S.xp);
            },
          });
        } else {
          animateHeaderXp(xpBefore, S.xp);
        }
      },
    });

    document.getElementById("dk-run-continue").onclick = startNextRun;
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
      document.getElementById("dk-yes2").onclick = nukeProgress;
    };
  }

  // Full factory reset: wipes learning progress (stats, runs, missions) AND
  // the chosen home language, so the app boots back into the first-run
  // language picker exactly as it does on a fresh install.
  function nukeProgress() {
    S.home = null;
    S.autoSpeak = false;
    S.stats = {};
    S.step = 0;
    S.totals = { right: 0, wrong: 0 };
    S.dir = "da-home";
    S.runStep = 0;
    S.runRight = 0;
    S.runWrong = 0;
    S.runResults = [];
    S.runWords = [];
    S.missionRun = 0;
    S.missionRight = 0;
    S.missionWrong = 0;
    S.missionsCompleted = 0;
    S.xp = 0;
    S.runXpGain = 0;
    S.missionXpGain = 0;
    current = null;
    revealed = false;
    busy = false;
    askDa = true;
    query = "";
    filter = "all";
    pickerOpen = false;
    // Drop any debounced write still in flight, otherwise it would re-create
    // the key we are about to delete.
    clearTimeout(saveTimer);
    try {
      window.localStorage.removeItem(KEY);
    } catch (e) {}
    try {
      if (hasStore()) window.storage["delete"](KEY);
    } catch (e) {}
    // setView() is a no-op without a home language, so go straight to
    // render() - it takes us to the first-run picker.
    view = "study";
    render();
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
    if (view !== "study" || !S.home || pickerOpen || S.runStep >= RUN_LEN) return;
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

  var settingsBtnEl = document.getElementById("dk-settingsbtn");
  var settingsMenuEl = document.getElementById("dk-settingsmenu");
  if (settingsBtnEl && settingsMenuEl) {
    settingsBtnEl.onclick = function (e) {
      e.stopPropagation();
      var opening = settingsMenuEl.hidden;
      settingsMenuEl.hidden = !opening;
      settingsBtnEl.setAttribute("aria-expanded", opening ? "true" : "false");
    };
    settingsMenuEl.onclick = function (e) {
      e.stopPropagation();
    };
    document.addEventListener("click", closeSettingsMenu);
  }

  var nukeBtnEl = document.getElementById("dk-nukebtn");
  if (nukeBtnEl)
    nukeBtnEl.onclick = function () {
      closeSettingsMenu();
      if (window.confirm(tt("nukeConfirm"))) nukeProgress();
    };

  initSpeech();
  function unlockAudio() {
    unlockSpeech();
    unlockSfx();
  }
  document.addEventListener("pointerdown", unlockAudio, true);
  document.addEventListener("touchstart", unlockAudio, true);

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
