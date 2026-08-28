// Turkish UI strings.
//
// Every key here must also exist in the other language files; a key missing
// from this file falls back to the default language at runtime rather than
// rendering blank (see t() in index.js).
//
// Counted strings are objects keyed by Intl.PluralRules category rather than
// arrays - use whichever categories Turkish actually has ("one"/"other" here;
// the noun itself is not inflected after a numeral, so both forms read the
// same). No plural function needs to be written: the category is derived from
// this file's language code.

export default {
  code: "tr",
  name: "Turkish",
  nativeName: "Türkçe",
  // Red field with the white crescent and star, drawn as two overlapping
  // circles plus a five-pointed star polygon.
  flag:
    '<svg viewBox="0 0 20 15" aria-hidden="true">' +
    '<rect width="20" height="15" fill="#E30A17"/>' +
    '<circle cx="7.2" cy="7.5" r="3" fill="#fff"/>' +
    '<circle cx="8.4" cy="7.5" r="2.4" fill="#E30A17"/>' +
    '<polygon fill="#fff" points="13.9,7.5 12.73,7.12 12.73,5.88 12,6.88 10.83,6.5 11.55,7.5 10.83,8.5 12,8.12 12.73,9.12 12.73,7.88"/>' +
    '</svg>',
  strings: {
    loading: "Yükleniyor…",
    tabStudy: "Alıştırma",
    tabWords: "Kelimeler",
    tabStats: "İlerleme",
    changeLanguage: "Dili değiştir",
    settingsBtn: "Ayarlar",
    nukeProgress: "Tüm ilerlemeyi sil",
    nukeConfirm: "Bu işlem tüm ilerlemeni kalıcı olarak siler. Geri alınamaz. Devam edilsin mi?",

    pickerTitle: "Ana dilini seç",
    pickerSub: "Danca kelimeler bu dildeki çevirileriyle gösterilecek.",
    pickerCancel: "İptal",

    leftOf: "{total} kelimeden {left} tanesi kaldı",
    scoreLine: "{right} doğru / {wrong} hatalı",
    runOf: "bu turda {step} / {total}",
    runComplete: "Tur tamamlandı",
    runScoreLine: "{total} kelimeden {right} doğru",
    runContinueBtn: "Sonraki tura başla",
    missionProgress: "Tur {n} / {total}",
    missionCompleteTitle: "Görev tamamlandı!",
    missedThisRun: "Bu turda bilemediklerin",
    perfectRunText: "Kusursuz tur — hiç hata yok!",
    missionCorrectLabel: "Bu görevde doğru",
    runsLeftLabel: {
      one: "tur kaldı",
      other: "tur kaldı",
    },
    startNextMissionBtn: "Sonraki göreve başla",
    xpBadgeTitle: "Toplam XP",
    xpGainedLabel: "Kazanılan XP",
    missionBonusLabel: "Görev bonusu",
    readAloud: "Sesli oku",
    noSpeech: "Bu tarayıcıda konuşma motoru yok, bu yüzden telaffuz kapalı.",
    noDanishVoice: "Bu cihazda Danca ses yok, bu yüzden telaffuz başka bir sesle yapılıyor. iOS'ta Ayarlar, Erişilebilirlik, Sesli İçerik, Sesler bölümünden ekleyebilirsin.",
    danishLabel: "dansk",
    homeLangLabel: "türkçe",
    listen: "dinle",
    showTranslation: "Çeviriyi göster",
    hintUpDown: "yukarı / aşağı",
    tapReveal: "Çeviriyi görmek için karta dokun",
    tapOrArrows: "Karta dokun ya da yukarı veya aşağı tuşuna bas",
    swipeHint: "Kartı sola veya sağa kaydır",
    knewIt: "Biliyordum",
    didntKnow: "Bilmiyordum",
    hintLeft: "sola",
    hintRight: "sağa",
    doneText: "Deste bitti. Her kelimeye doğru cevap verdin, bu yüzden deste boş. Baştan çalışmak için İlerleme bölümünden sıfırla.",

    searchPlaceholder: "Dancada veya Türkçede ara",
    chipAll: "Tümü",
    chipUnseen: "Görülmedi",
    chipMissed: "Hâlâ destede",
    chipRetired: "Öğrenildi",
    browseCountWords: {
      one: "{n} kelime",
      other: "{n} kelime",
    },
    browseShowingFirst: " — ilk {n} tanesi gösteriliyor",
    emptyWords: "Sonuç yok. Daha kısa bir arama ya da başka bir filtre dene.",
    retiredBadge: "öğrenildi",

    metricRetiredLabel: "Öğrenildi",
    metricRetiredSub: "{n} kelimeden",
    metricAccuracyLabel: "Doğruluk",
    metricAccuracySub: {
      one: "{n} cevap",
      other: "{n} cevap",
    },
    metricLeftLabel: "Kalan",
    metricLeftSub: {
      one: "{n} tanesi yanlış bilindi",
      other: "{n} tanesi yanlış bilindi",
    },
    pileHeader: "Deste",
    barRetired: "Öğrenildi — doğru bilindi",
    barMissed: "Yanlış bilindi, hâlâ destede",
    barUntouched: "Henüz görülmedi",
    troubleHeader: "Yanlış bilinen ve hâlâ destede olanlar",
    troubleEmpty: "Henüz hata yok. Yanlış bildiğin kelimeler destede kalır ve burada görünür.",
    tally: "{n} kez yanlış",
    resetProgress: "İlerlemeyi sıfırla",
    resetWarning: "Her şeyi siler.",
    resetYes: "Evet, sıfırla",
    resetCancel: "İptal",
  },
};
