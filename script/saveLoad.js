
const saveToTxt = () => {
    let txtSave = ""    

    return txtSave
}

const loadFromTxt = (txtSave) => {
    const saveObj = JSON.parse(txtSave)

    clearAllSheets()

    const sheet = createEmptySheet()

    rythmTitle = saveObj.title
    rythmTempo = saveObj.tempo || 120

    notesInBar = saveObj.notesInBar || 4
    barsInRow = saveObj.barsInRow || 4

    createTitleInSheet(sheet, rythmTitle)
    createTempoInSheet(sheet, rythmTempo)

    let previousNote = null

    const nextNote = (fromNote) => {
        /**
         * This function returns next note. If there are no more notes,
         * it creates new row
         */

        if (fromNote) {
            if (fromNote.nextSibling) {
                // Let's return the next child
                return fromNote.nextSibling
            }

            // This bit doesn't have anymore notes
            // ...let's get next bit
            var bit = getNextBit(fromNote.parentNode)
        }else {
            var bit = null
        }

        if (!bit) {
            // There are no more bits - let's create a new row
            const row = createEmptyRow(notesInBar, barsInRow)
            sheet.appendChild(row)

            bit = row.firstChild.firstChild
        }

        return bit.firstChild
    }
    
    const noteDefToNote = {
        "-": "empty",
        "B": "bass",
        "T": "tone",
        "S": "slap",
    }

    const rythmDefinition = saveObj.rythm || []

    for (let i=0; i<rythmDefinition.length; i++) {
        let noteDef = rythmDefinition[i]
        
        let noteBtn = nextNote(previousNote)

        switch (noteDef) {
        case "2":
            changeOneBitToDouble(noteBtn.parentNode, false)
            break
        case "3":
            changeOneBitToTriplet(noteBtn.parentNode, [], false)
            break
        case "-":
        case "B":
        case "T":
        case "S":
            const note = noteDefToNote[noteDef]
            setNoteForNoteBtn(noteBtn, note)
            previousNote = noteBtn
            break
        default:
            console.log(`Load error: unknown note definition: '${noteDef}'`)
        }
    }

    createAddRowBtnInSheet(sheet)
}
