// Armenian UI strings.
//
// Every key here must also exist in the other language files; a key missing
// from this file falls back to the default language at runtime rather than
// rendering blank (see t() in index.js).
//
// Counted strings are objects keyed by Intl.PluralRules category rather than
// arrays - Armenian has "one" (0 and 1) and "other". No plural function needs
// to be written: the category is derived from this file's language code. The
// noun itself stays singular after a numeral in Armenian, so both forms of a
// counted string are often written the same way on purpose.

export default {
  code: "hy",
  name: "Armenian",
  nativeName: "Հայերեն",
  // Red-blue-orange horizontal thirds, the Armenian tricolour.
  flag:
    '<svg viewBox="0 0 20 15" aria-hidden="true">' +
    '<rect width="20" height="15" fill="#F2A800"/>' +
    '<rect width="20" height="10" fill="#0033A0"/>' +
    '<rect width="20" height="5" fill="#D90012"/>' +
    '</svg>',
  strings: {
    loading: "Բեռնվում է…",
    tabStudy: "Վարժանք",
    tabWords: "Բառեր",
    tabStats: "Առաջընթաց",
    changeLanguage: "Փոխել լեզուն",
    settingsBtn: "Կարգավորումներ",
    nukeProgress: "Ջնջել ամբողջ առաջընթացը",
    nukeConfirm: "Սա ընդմիշտ կջնջի ձեր ամբողջ առաջընթացը։ Հետ վերադարձ չկա։ Շարունակե՞լ։",

    pickerTitle: "Ընտրեք ձեր լեզուն",
    pickerSub: "Դանիերեն բառերը կցուցադրվեն այս լեզվով թարգմանությամբ։",
    pickerCancel: "Չեղարկել",

    leftOf: "մնաց {left}՝ {total}-ից",
    scoreLine: "{right} ճիշտ / {wrong} սխալ",
    runOf: "{step} / {total} այս փուլում",
    runComplete: "Փուլն ավարտվեց",
    runScoreLine: "{total}-ից {right} ճիշտ",
    runContinueBtn: "Սկսել հաջորդ փուլը",
    missionProgress: "Փուլ {n}՝ {total}-ից",
    missionCompleteTitle: "Առաքելությունը կատարվեց",
    missedThisRun: "Այս փուլում սխալվածները",
    perfectRunText: "Կատարյալ փուլ՝ ոչ մի սխալ։",
    missionCorrectLabel: "Ճիշտ այս առաքելությունում",
    runsLeftLabel: {
      one: "փուլ է մնացել",
      other: "փուլ է մնացել",
    },
    startNextMissionBtn: "Սկսել հաջորդ առաքելությունը",
    xpBadgeTitle: "Ընդհանուր XP",
    xpGainedLabel: "Վաստակած XP",
    missionBonusLabel: "Առաքելության բոնուս",
    readAloud: "Կարդալ բարձրաձայն",
    noSpeech: "Այս զննարկիչը խոսքի շարժիչ չունի, ուստի արտասանությունն անջատված է։",
    noDanishVoice: "Այս սարքում դանիերեն ձայն չկա, ուստի արտասանության համար այլ ձայն է օգտագործվում։ iOS-ում ավելացրեք այն Կարգավորումներ, Հասանելիություն, Բարձրաձայն բովանդակություն, Ձայներ բաժնում։",
    danishLabel: "dansk",
    homeLangLabel: "հայերեն",
    listen: "լսել",
    showTranslation: "Ցույց տալ թարգմանությունը",
    hintUpDown: "վեր / վար",
    tapReveal: "Հպեք քարտին՝ թարգմանությունը տեսնելու համար",
    tapOrArrows: "Հպեք քարտին կամ սեղմեք վեր կամ վար",
    swipeHint: "Սահեցրեք քարտը ձախ կամ աջ",
    knewIt: "Գիտեի",
    didntKnow: "Չգիտեի",
    hintLeft: "ձախ",
    hintRight: "աջ",
    doneText: "Ավարտված է։ Բոլոր բառերին ճիշտ եք պատասխանել, ուստի կույտը դատարկ է։ Նորից անցնելու համար զրոյացրեք Առաջընթաց բաժնից։",

    searchPlaceholder: "Որոնել դանիերեն կամ հայերեն",
    chipAll: "Բոլորը",
    chipUnseen: "Չտեսնված",
    chipMissed: "Դեռ խաղում",
    chipRetired: "Սովորած",
    browseCountWords: {
      one: "{n} բառ",
      other: "{n} բառ",
    },
    browseShowingFirst: " — ցուցադրվում է առաջին {n}-ը",
    emptyWords: "Համընկնում չկա։ Փորձեք ավելի կարճ որոնում կամ այլ զտիչ։",
    retiredBadge: "սովորած",

    metricRetiredLabel: "Սովորած",
    metricRetiredSub: "{n}-ից",
    metricAccuracyLabel: "Ճշտություն",
    metricAccuracySub: {
      one: "{n} պատասխան",
      other: "{n} պատասխան",
    },
    metricLeftLabel: "Մնացել է",
    metricLeftSub: {
      one: "{n} սխալված բառ",
      other: "{n} սխալված բառ",
    },
    pileHeader: "Կույտը",
    barRetired: "Սովորած՝ ճիշտ պատասխանված",
    barMissed: "Սխալված, դեռ խաղում",
    barUntouched: "Դեռ չտեսնված",
    troubleHeader: "Սխալված և դեռ խաղում",
    troubleEmpty: "Դեռ ոչ մի սխալ չկա։ Սխալ պատասխանված բառերը մնում են կույտում և հայտնվում այստեղ։",
    tally: "սխալվել է {n} անգամ",
    resetProgress: "Զրոյացնել առաջընթացը",
    resetWarning: "Ջնջում է ամեն ինչ։",
    resetYes: "Այո, զրոյացնել",
    resetCancel: "Չեղարկել",
  },
};
