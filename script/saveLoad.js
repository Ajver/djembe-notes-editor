
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
    const rhythmDefinition = getNotesDefinition(allNotes)

    const saveObj = {
        title: rhythmTitle,
        tempo: rhythmTempo,
        partsInBeat: partsInBeat,
        beatsInBar: beatsInBar,
        barsInFullScore: barsInFullScore,
        rhythm: rhythmDefinition,
    }
    const txtSave = JSON.stringify(saveObj)    
    return txtSave
}

const loadFromTxt = (txtSave) => {
    const saveObj = JSON.parse(txtSave)

    clearAllSheets()

    let sheet = createEmptySheet()

    rhythmTitle = saveObj.title
    rhythmTempo = saveObj.tempo || 120

    partsInBeat = saveObj.partsInBeat || 4
    beatsInBar = saveObj.beatsInBar || 4
    barsInFullScore = saveObj.barsInFullScore || 1

    createTitleInSheet(sheet, rhythmTitle)
    createTempoInSheet(sheet, rhythmTempo)

    loadNotesFromText(saveObj.rhythm, null)

    // Re-set sheet to the last sheet, so we edit the last sheet
    sheet = getLastSheet()
    
    createAddFullScoreBtnInSheet(sheet)
    
    // Check if maybe sheet is overflow, and fix it if needed
    fixSheetOverflow(sheet)
}
