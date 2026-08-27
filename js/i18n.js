// UI chrome translations (not the vocabulary data - that's in data/words.js).
//
// The app is always teaching Danish. "Home language" is the language the
// learner already speaks, i.e. which column of data/words.js is shown as
// the translation, and which of the dictionaries below drives the UI text.
//
// To add a new home language:
//   1. Add a column to every line in data/words.js (da|en|uk|<new>).
//   2. Add an entry to HOME_LANGUAGES below with its own `strings` object
//      (copy the `en` block and translate every value; `plural` is optional,
//      only needed if the language's counting rules aren't "n === 1").
//   3. That's it - the picker, search placeholder, direction buttons, etc.
//      all pick it up automatically.

function ukPlural(n, forms) {
  var abs = Math.abs(n) % 100;
  var n1 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

function enPlural(n, forms) {
  return n === 1 ? forms[0] : forms[1];
}

export var HOME_LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    plural: enPlural,
    strings: {
      loading: "Loading…",
      tabStudy: "Practice",
      tabWords: "Words",
      tabStats: "Progress",
      changeLanguage: "Change language",
      settingsBtn: "Settings",
      nukeProgress: "Delete all progress",
      nukeConfirm:
        "This will permanently delete all your progress. This can't be undone. Continue?",

      pickerTitle: "Which language do you speak?",
      pickerSub: "Pick your language to start learning Danish.",
      pickerCancel: "Cancel",

      leftOf: "{left} of {total} left",
      scoreLine: "{right} ok / {wrong} missed",
      runOf: "{step} / {total} this run",
      runComplete: "Run complete",
      runScoreLine: "{right} of {total} correct",
      runContinueBtn: "Start next run",
      missionProgress: "Run {n} of {total}",
      missionCompleteTitle: "Mission complete!",
      missedThisRun: "Missed this run",
      perfectRunText: "Perfect run - no misses!",
      missionCorrectLabel: "Correct this mission",
      runsLeftLabel: ["run left", "runs left"],
      startNextMissionBtn: "Start next mission",
      readAloud: "Read out loud",
      noSpeech: "This browser has no speech engine, so pronunciation is off.",
      noDanishVoice:
        "No Danish voice on this device, so pronunciation uses another voice. On iOS add one under Settings, Accessibility, Spoken Content, Voices.",
      danishLabel: "dansk",
      homeLangLabel: "english",
      listen: "listen",
      showTranslation: "Show translation",
      hintUpDown: "up / down",
      tapReveal: "Tap the card to reveal",
      tapOrArrows: "Tap the card, or press up or down",
      swipeHint: "Swipe the card left or right",
      knewIt: "Knew it",
      didntKnow: "Didn't know",
      hintLeft: "left",
      hintRight: "right",
      doneText:
        "Cleared. Every word got a correct answer, so the pile is empty. Reset from Progress to run through them again.",

      searchPlaceholder: "Search Danish or English",
      chipAll: "All",
      chipUnseen: "Not seen",
      chipMissed: "Still in play",
      chipRetired: "Retired",
      browseCountWords: ["{n} word", "{n} words"],
      browseShowingFirst: " - showing first {n}",
      emptyWords: "No matches. Try a shorter search or another filter.",
      retiredBadge: "retired",

      metricRetiredLabel: "Retired",
      metricRetiredSub: "of {n}",
      metricAccuracyLabel: "Accuracy",
      metricAccuracySub: ["{n} answer", "{n} answers"],
      metricLeftLabel: "Still to go",
      metricLeftSub: ["{n} missed once", "{n} missed once"],
      pileHeader: "The pile",
      barRetired: "Retired - got it right",
      barMissed: "Missed, still in play",
      barUntouched: "Not seen yet",
      troubleHeader: "Missed and still in play",
      troubleEmpty:
        "Nothing missed yet. Words you get wrong stay in the pile and show up here.",
      tally: "missed {n}x",
      resetProgress: "Reset progress",
      resetWarning: "Erases everything.",
      resetYes: "Yes, reset",
      resetCancel: "Cancel",
    },
  },

  uk: {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Українська",
    plural: ukPlural,
    strings: {
      loading: "Завантаження…",
      tabStudy: "Практика",
      tabWords: "Слова",
      tabStats: "Прогрес",
      changeLanguage: "Змінити мову",
      settingsBtn: "Налаштування",
      nukeProgress: "Видалити весь прогрес",
      nukeConfirm:
        "Це назавжди видалить увесь ваш прогрес. Дію не можна скасувати. Продовжити?",

      pickerTitle: "Якою мовою ви розмовляєте?",
      pickerSub:
        "Оберіть свою мову, щоб почати вивчати данську.",
      pickerCancel: "Скасувати",

      leftOf: "залишилось {left} з {total}",
      scoreLine: "{right} правильно / {wrong} помилково",
      runOf: "{step} / {total} у цьому раунді",
      runComplete: "Раунд завершено",
      runScoreLine: "{right} з {total} правильно",
      runContinueBtn: "Почати новий раунд",
      missionProgress: "Раунд {n} з {total}",
      missionCompleteTitle: "Місію завершено!",
      missedThisRun: "Помилки цього раунду",
      perfectRunText: "Ідеальний раунд — без помилок!",
      missionCorrectLabel: "Правильно за місію",
      runsLeftLabel: [
        "раунд залишився",
        "раунди залишилось",
        "раундів залишилось",
      ],
      startNextMissionBtn: "Почати нову місію",
      readAloud: "Читати вголос",
      noSpeech:
        "У цьому браузері немає рушія озвучення, тому вимова вимкнена.",
      noDanishVoice:
        "На цьому пристрої немає данського голосу, тому вимова використовує інший. На iOS його можна додати в Налаштуваннях, Спецможливості, Озвучений контент, Голоси.",
      danishLabel: "dansk",
      homeLangLabel: "українська",
      listen: "прослухати",
      showTranslation: "Показати переклад",
      hintUpDown: "вгору / вниз",
      tapReveal: "Торкніться картки, щоб показати переклад",
      tapOrArrows:
        "Торкніться картки або натисніть стрілку вгору чи вниз",
      swipeHint: "Свайпніть картку вліво або вправо",
      knewIt: "Знаю",
      didntKnow: "Не знаю",
      hintLeft: "вліво",
      hintRight: "вправо",
      doneText:
        "Готово. Кожне слово відповідано правильно, тому колода порожня. Скиньте прогрес у розділі «Прогрес», щоб пройти їх знову.",

      searchPlaceholder: "Пошук данською або українською",
      chipAll: "Усі",
      chipUnseen: "Нові",
      chipMissed: "У грі",
      chipRetired: "Вивчені",
      browseCountWords: [
        "{n} слово",
        "{n} слова",
        "{n} слів",
      ],
      browseShowingFirst: " — показано перші {n}",
      emptyWords:
        "Нічого не знайдено. Спробуйте коротший запит або інший фільтр.",
      retiredBadge: "вивчено",

      metricRetiredLabel: "Вивчено",
      metricRetiredSub: "з {n}",
      metricAccuracyLabel: "Точність",
      metricAccuracySub: [
        "{n} відповідь",
        "{n} відповіді",
        "{n} відповідей",
      ],
      metricLeftLabel: "Залишилось",
      metricLeftSub: [
        "{n} з помилкою",
        "{n} з помилками",
        "{n} з помилками",
      ],
      pileHeader: "Колода",
      barRetired: "Вивчені — відповідали правильно",
      barMissed: "З помилками, ще в грі",
      barUntouched: "Ще не бачені",
      troubleHeader: "Помилки, що ще в грі",
      troubleEmpty:
        "Поки що без помилок. Слова, у яких ви помиляєтесь, залишаються в колоді та з’являються тут.",
      tally: "помилок: {n}",
      resetProgress: "Скинути прогрес",
      resetWarning: "Видалить усе.",
      resetYes: "Так, скинути",
      resetCancel: "Скасувати",
    },
  },
};

export var DEFAULT_HOME = "en";

export function t(homeCode, key, vars) {
  var lang = HOME_LANGUAGES[homeCode] || HOME_LANGUAGES[DEFAULT_HOME];
  var raw = lang.strings[key];
  if (raw == null) return "";
  var str;
  if (Array.isArray(raw)) {
    var n = vars && typeof vars.n === "number" ? vars.n : 0;
    str = lang.plural(n, raw);
  } else {
    str = raw;
  }
  if (vars) {
    for (var k in vars) {
      if (!Object.prototype.hasOwnProperty.call(vars, k)) continue;
      str = str.split("{" + k + "}").join(vars[k]);
    }
  }
  return str;
}
