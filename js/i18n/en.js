// English UI strings.
//
// Every key here must also exist in the other language files; a key missing
// from this file falls back to the default language at runtime rather than
// rendering blank (see t() in index.js).
//
// Counted strings are objects keyed by Intl.PluralRules category rather than
// arrays - use whichever categories English actually has ("one"/"other" in
// English, "one"/"few"/"many" in Ukrainian, and so on). No plural function
// needs to be written: the category is derived from this file's language code.

export default {
  code: "en",
  name: "English",
  nativeName: "English",
  strings: {
    loading: "Loading…",
    tabStudy: "Practice",
    tabWords: "Words",
    tabStats: "Progress",
    changeLanguage: "Change language",
    settingsBtn: "Settings",
    nukeProgress: "Delete all progress",
    nukeConfirm: "This will permanently delete all your progress. This can't be undone. Continue?",

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
    runsLeftLabel: {
      one: "run left",
      other: "runs left",
    },
    startNextMissionBtn: "Start next mission",
    xpBadgeTitle: "Total XP",
    xpGainedLabel: "XP earned",
    missionBonusLabel: "Mission bonus",
    readAloud: "Read out loud",
    noSpeech: "This browser has no speech engine, so pronunciation is off.",
    noDanishVoice: "No Danish voice on this device, so pronunciation uses another voice. On iOS add one under Settings, Accessibility, Spoken Content, Voices.",
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
    doneText: "Cleared. Every word got a correct answer, so the pile is empty. Reset from Progress to run through them again.",

    searchPlaceholder: "Search Danish or English",
    chipAll: "All",
    chipUnseen: "Not seen",
    chipMissed: "Still in play",
    chipRetired: "Retired",
    browseCountWords: {
      one: "{n} word",
      other: "{n} words",
    },
    browseShowingFirst: " - showing first {n}",
    emptyWords: "No matches. Try a shorter search or another filter.",
    retiredBadge: "retired",

    metricRetiredLabel: "Retired",
    metricRetiredSub: "of {n}",
    metricAccuracyLabel: "Accuracy",
    metricAccuracySub: {
      one: "{n} answer",
      other: "{n} answers",
    },
    metricLeftLabel: "Still to go",
    metricLeftSub: {
      one: "{n} missed once",
      other: "{n} missed once",
    },
    pileHeader: "The pile",
    barRetired: "Retired - got it right",
    barMissed: "Missed, still in play",
    barUntouched: "Not seen yet",
    troubleHeader: "Missed and still in play",
    troubleEmpty: "Nothing missed yet. Words you get wrong stay in the pile and show up here.",
    tally: "missed {n}x",
    resetProgress: "Reset progress",
    resetWarning: "Erases everything.",
    resetYes: "Yes, reset",
    resetCancel: "Cancel",
  },
};
