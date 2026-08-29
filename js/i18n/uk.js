// Ukrainian UI strings.
//
// Every key here must also exist in the other language files; a key missing
// from this file falls back to the default language at runtime rather than
// rendering blank (see t() in index.js).
//
// Counted strings are objects keyed by Intl.PluralRules category rather than
// arrays - use whichever categories Ukrainian actually has ("one"/"other" in
// English, "one"/"few"/"many" in Ukrainian, and so on). No plural function
// needs to be written: the category is derived from this file's language code.

export default {
  code: "uk",
  name: "Ukrainian",
  nativeName: "Українська",
  flag:
    '<svg viewBox="0 0 20 15" aria-hidden="true">' +
    '<rect width="20" height="7.5" fill="#0057B7"/>' +
    '<rect y="7.5" width="20" height="7.5" fill="#FFD700"/>' +
    '</svg>',
  strings: {
    loading: "Завантаження…",
    tabStudy: "Практика",
    tabWords: "Слова",
    tabStats: "Прогрес",
    changeLanguage: "Змінити мову",
    settingsBtn: "Налаштування",
    nukeProgress: "Видалити весь прогрес",
    nukeConfirm: "Це назавжди видалить увесь ваш прогрес. Дію не можна скасувати. Продовжити?",

    pickerTitle: "Оберіть свою рідну мову",
    pickerSub: "Данські слова показуватимуться з перекладом цією мовою.",
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
    runsLeftLabel: {
      one: "раунд залишився",
      few: "раунди залишилось",
      many: "раундів залишилось",
    },
    startNextMissionBtn: "Почати нову місію",
    xpBadgeTitle: "Загальний досвід",
    xpGainedLabel: "Отримано XP",
    missionBonusLabel: "Бонус місії",
    readAloud: "Читати вголос",
    noSpeech: "У цьому браузері немає рушія озвучення, тому вимова вимкнена.",
    noDanishVoice: "На цьому пристрої немає данського голосу, тому вимова використовує інший. На iOS його можна додати в Налаштуваннях, Спецможливості, Озвучений контент, Голоси.",
    danishLabel: "dansk",
    sourceTatoeba: "Татоеба",
    homeLangLabel: "українська",
    listen: "прослухати",
    showTranslation: "Показати переклад",
    hintUpDown: "вгору / вниз",
    tapReveal: "Торкніться картки, щоб показати переклад",
    tapOrArrows: "Торкніться картки або натисніть стрілку вгору чи вниз",
    swipeHint: "Свайпніть картку вліво або вправо",
    knewIt: "Знаю",
    didntKnow: "Не знаю",
    hintLeft: "вліво",
    hintRight: "вправо",
    doneText: "Готово. Кожне слово відповідано правильно, тому колода порожня. Скиньте прогрес у розділі «Прогрес», щоб пройти їх знову.",

    searchPlaceholder: "Пошук данською або українською",
    chipAll: "Усі",
    chipUnseen: "Нові",
    chipMissed: "У грі",
    chipRetired: "Вивчені",
    browseCountWords: {
      one: "{n} слово",
      few: "{n} слова",
      many: "{n} слів",
    },
    browseShowingFirst: " — показано перші {n}",
    emptyWords: "Нічого не знайдено. Спробуйте коротший запит або інший фільтр.",
    retiredBadge: "вивчено",

    metricRetiredLabel: "Вивчено",
    metricRetiredSub: "з {n}",
    metricAccuracyLabel: "Точність",
    metricAccuracySub: {
      one: "{n} відповідь",
      few: "{n} відповіді",
      many: "{n} відповідей",
    },
    metricLeftLabel: "Залишилось",
    metricLeftSub: {
      one: "{n} з помилкою",
      few: "{n} з помилками",
      many: "{n} з помилками",
    },
    pileHeader: "Колода",
    barRetired: "Вивчені — відповідали правильно",
    barMissed: "З помилками, ще в грі",
    barUntouched: "Ще не бачені",
    troubleHeader: "Помилки, що ще в грі",
    troubleEmpty: "Поки що без помилок. Слова, у яких ви помиляєтесь, залишаються в колоді та з’являються тут.",
    tally: "помилок: {n}",
    resetProgress: "Скинути прогрес",
    resetWarning: "Видалить усе.",
    resetYes: "Так, скинути",
    resetCancel: "Скасувати",
  },
};
