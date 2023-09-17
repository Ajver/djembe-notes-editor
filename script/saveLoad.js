
const noteToNoteDef = {
    "empty": "-",
    "bass": "B",
    "tone": "T",
    "slap": "S",
    "ghost": "G",
}

const noteDefToNote = {
    "-": "empty",
    "B": "bass",
    "T": "tone",
    "S": "slap",
    "G": "ghost",
}

const beatPartTypeToDef = {
    "single": "",
    "double": "2",
    "triplet": "3",
    "grace": "g",
}

const saveToTxt = () => {
    const allNotes = getAllNotes()
    const rythmDefinition = getNotesDefinition(allNotes)

    const saveObj = {
        title: rythmTitle,
        tempo: rythmTempo,
        partsInBeat: partsInBeat,
        beatsInBar: beatsInBar,
        barsInFullScore: barsInFullScore,
        rythm: rythmDefinition,
    }
    const txtSave = JSON.stringify(saveObj)    
    return txtSave
}

const loadFromTxt = (txtSave) => {
    const saveObj = JSON.parse(txtSave)

    clearAllSheets()

    let sheet = createEmptySheet()

    rythmTitle = saveObj.title
    rythmTempo = saveObj.tempo || 120

    partsInBeat = saveObj.partsInBeat || 4
    beatsInBar = saveObj.beatsInBar || 4
    barsInFullScore = saveObj.barsInFullScore || 1

    createTitleInSheet(sheet, rythmTitle)
    createTempoInSheet(sheet, rythmTempo)

    loadNotesFromText(saveObj.rythm, null)

    // Re-set sheet to the last sheet, so we edit the last sheet
    sheet = getLastSheet()
    
    createAddFullScoreBtnInSheet(sheet)
    
    // Check if maybe sheet is overflow, and fix it if needed
    fixSheetOverflow(sheet)
}
