// Spanish UI strings.
//
// Every key here must also exist in the other language files; a key missing
// from this file falls back to the default language at runtime rather than
// rendering blank (see t() in index.js).
//
// Counted strings are objects keyed by Intl.PluralRules category rather than
// arrays - use whichever categories Spanish actually has ("one"/"other").
// No plural function needs to be written: the category is derived from this
// file's language code.

export default {
  code: "es",
  name: "Spanish",
  nativeName: "Español",
  // Red-yellow-red horizontal bands, in the 1:2:1 proportions of the Spanish
  // flag. The coat of arms is left off - it is unreadable at 22px.
  flag:
    '<svg viewBox="0 0 20 15" aria-hidden="true">' +
    '<rect width="20" height="15" fill="#AA151B"/>' +
    '<rect y="3.75" width="20" height="7.5" fill="#F1BF00"/>' +
    '</svg>',
  strings: {
    loading: "Cargando…",
    tabStudy: "Practicar",
    tabWords: "Palabras",
    tabStats: "Progreso",
    changeLanguage: "Cambiar de idioma",
    settingsBtn: "Ajustes",
    nukeProgress: "Borrar todo el progreso",
    nukeConfirm: "Esto borrará permanentemente todo tu progreso. No se puede deshacer. ¿Continuar?",

    pickerTitle: "Elige tu idioma",
    pickerSub: "Las palabras danesas se mostrarán con su traducción en este idioma.",
    pickerCancel: "Cancelar",

    runComplete: "Ronda completada",
    runContinueBtn: "Empezar la siguiente ronda",
    missionProgress: "Ronda {n} de {total}",
    missionCompleteTitle: "¡Misión completada!",
    missedThisRun: "Falladas en esta ronda",
    perfectRunText: "Ronda perfecta: ¡ningún fallo!",
    startNextMissionBtn: "Empezar la siguiente misión",
    xpBadgeTitle: "XP total",
    xpGainedLabel: "XP ganados",
    missionBonusLabel: "Bonus de misión",
    readAloud: "Leer en voz alta",
    noSpeech: "Este navegador no tiene motor de voz, así que la pronunciación está desactivada.",
    noDanishVoice: "No hay voz danesa en este dispositivo, así que la pronunciación usa otra voz. En iOS puedes añadir una en Ajustes, Accesibilidad, Contenido hablado, Voces.",
    danishLabel: "dansk",
    sourceTatoeba: "Tatoeba",
    sourceHestenettet: "Hestenettet",
    sourceBlinkendeLygter: "Blinkende Lygter",
    homeLangLabel: "español",
    listen: "escuchar",
    showTranslation: "Mostrar la traducción",
    hintUpDown: "arriba / abajo",
    tapReveal: "Toca la tarjeta para ver la traducción",
    tapOrArrows: "Toca la tarjeta o pulsa arriba o abajo",
    swipeHint: "Desliza la tarjeta a la izquierda o a la derecha",
    knewIt: "La sabía",
    didntKnow: "No la sabía",
    hintLeft: "izquierda",
    hintRight: "derecha",
    doneText: "Mazo terminado. Acertaste todas las palabras, así que el montón está vacío. Reinicia desde Progreso para repasarlas otra vez.",

    searchPlaceholder: "Buscar en danés o en español",
    chipAll: "Todas",
    chipUnseen: "Sin ver",
    chipMissed: "Aún en juego",
    chipRetired: "Aprendidas",
    browseCountWords: {
      one: "{n} palabra",
      other: "{n} palabras",
    },
    browseShowingFirst: " — mostrando las {n} primeras",
    emptyWords: "Sin resultados. Prueba con una búsqueda más corta u otro filtro.",
    retiredBadge: "aprendida",

    metricRetiredLabel: "Aprendidas",
    metricRetiredSub: "de {n}",
    metricAccuracyLabel: "Aciertos",
    metricAccuracySub: {
      one: "{n} respuesta",
      other: "{n} respuestas",
    },
    metricLeftLabel: "Por aprender",
    metricLeftSub: {
      one: "{n} fallada al menos una vez",
      other: "{n} falladas al menos una vez",
    },
    pileHeader: "El montón",
    barRetired: "Aprendidas: acertadas",
    barMissed: "Falladas, aún en juego",
    barUntouched: "Aún sin ver",
    troubleHeader: "Falladas y aún en juego",
    troubleEmpty: "Todavía no has fallado ninguna. Las palabras que falles se quedan en el montón y aparecen aquí.",
    tally: "fallos: {n}",
    resetProgress: "Reiniciar el progreso",
    resetWarning: "Lo borra todo.",
    resetYes: "Sí, reiniciar",
    resetCancel: "Cancelar",
  },
};
