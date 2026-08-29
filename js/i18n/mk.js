// Macedonian UI strings.
//
// Every key here must also exist in the other language files; a key missing
// from this file falls back to the default language at runtime rather than
// rendering blank (see t() in index.js).
//
// Counted strings are objects keyed by Intl.PluralRules category rather than
// arrays - Macedonian has "one" (anything ending in 1 except 11) and "other".
// No plural function needs to be written: the category is derived from this
// file's language code.

export default {
  code: "mk",
  name: "Macedonian",
  nativeName: "Македонски",
  // Red field with the golden eight-rayed sun, reduced to strokes plus a disc
  // so it still reads at 22px.
  flag:
    '<svg viewBox="0 0 20 15" aria-hidden="true">' +
    '<rect width="20" height="15" fill="#D20000"/>' +
    '<g stroke="#F8E71C" stroke-width="2.2">' +
    '<path d="M0 7.5H20M10 0V15"/>' +
    '<path d="M0 0 20 15M20 0 0 15"/>' +
    "</g>" +
    '<circle cx="10" cy="7.5" r="3.4" fill="#D20000"/>' +
    '<circle cx="10" cy="7.5" r="2.6" fill="#F8E71C"/>' +
    "</svg>",
  strings: {
    loading: "Се вчитува…",
    tabStudy: "Вежбање",
    tabWords: "Зборови",
    tabStats: "Напредок",
    changeLanguage: "Промени јазик",
    settingsBtn: "Поставки",
    nukeProgress: "Избриши го целиот напредок",
    nukeConfirm: "Ова трајно ќе го избрише целиот твој напредок. Не може да се врати. Да продолжиме?",

    pickerTitle: "Избери го твојот јазик",
    pickerSub: "Данските зборови ќе се прикажуваат со превод на овој јазик.",
    pickerCancel: "Откажи",

    leftOf: "преостануваат {left} од {total}",
    scoreLine: "{right} точни / {wrong} погрешени",
    runOf: "{step} / {total} во овој круг",
    runComplete: "Кругот заврши",
    runScoreLine: "{right} од {total} точни",
    runContinueBtn: "Почни нов круг",
    missionProgress: "Круг {n} од {total}",
    missionCompleteTitle: "Мисијата е завршена!",
    missedThisRun: "Погрешени во овој круг",
    perfectRunText: "Совршен круг - ниту една грешка!",
    missionCorrectLabel: "Точни во оваа мисија",
    runsLeftLabel: {
      one: "преостанат круг",
      other: "преостанати круга",
    },
    startNextMissionBtn: "Почни нова мисија",
    xpBadgeTitle: "Вкупно XP",
    xpGainedLabel: "Освоени XP",
    missionBonusLabel: "Бонус за мисијата",
    readAloud: "Прочитај на глас",
    noSpeech: "Овој прелистувач нема говорен мотор, па изговорот е исклучен.",
    noDanishVoice: "На овој уред нема дански глас, па изговорот користи друг глас. На iOS додај го во Поставки, Пристапност, Изговорена содржина, Гласови.",
    danishLabel: "dansk",
    sourceTatoeba: "Татоеба",
    sourceHestenettet: "Хестенетет",
    homeLangLabel: "македонски",
    listen: "слушни",
    showTranslation: "Прикажи го преводот",
    hintUpDown: "горе / долу",
    tapReveal: "Допри ја картичката за да го видиш преводот",
    tapOrArrows: "Допри ја картичката или притисни горе или долу",
    swipeHint: "Повлечи ја картичката лево или десно",
    knewIt: "Го знаев",
    didntKnow: "Не го знаев",
    hintLeft: "лево",
    hintRight: "десно",
    doneText: "Готово. На секој збор одговори точно, па купчето е празно. Ресетирај од Напредок за да ги поминеш повторно.",

    searchPlaceholder: "Пребарај на дански или македонски",
    chipAll: "Сите",
    chipUnseen: "Невидени",
    chipMissed: "Сè уште во игра",
    chipRetired: "Научени",
    browseCountWords: {
      one: "{n} збор",
      other: "{n} зборови",
    },
    browseShowingFirst: " - прикажани се првите {n}",
    emptyWords: "Нема совпаѓања. Пробај пократко пребарување или друг филтер.",
    retiredBadge: "научен",

    metricRetiredLabel: "Научени",
    metricRetiredSub: "од {n}",
    metricAccuracyLabel: "Точност",
    metricAccuracySub: {
      one: "{n} одговор",
      other: "{n} одговори",
    },
    metricLeftLabel: "Остануваат",
    metricLeftSub: {
      one: "{n} погрешен збор",
      other: "{n} погрешени зборови",
    },
    pileHeader: "Купчето",
    barRetired: "Научени - одговорени точно",
    barMissed: "Погрешени, сè уште во игра",
    barUntouched: "Сè уште невидени",
    troubleHeader: "Погрешени и сè уште во игра",
    troubleEmpty: "Сè уште нема грешки. Зборовите што ќе ги погрешиш остануваат во купчето и се појавуваат овде.",
    tally: "погрешен {n}x",
    resetProgress: "Ресетирај го напредокот",
    resetWarning: "Брише сè.",
    resetYes: "Да, ресетирај",
    resetCancel: "Откажи",
  },
};
