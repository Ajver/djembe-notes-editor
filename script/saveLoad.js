
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

const bitTypeToDef = {
    "single": "",
    "double": "2",
    "triplet": "3",
    "grace": "g",
}

const saveToTxt = () => {
    let rythmDefinition = ""

    document.querySelectorAll(".bit").forEach((bitBtn) => {
        const bitType = bitBtn.getAttribute("bit-type")
        const typeDef = bitTypeToDef[bitType]
        rythmDefinition += typeDef

        bitBtn.querySelectorAll("img").forEach((noteBtn) => {
            const note = noteToNoteDef[noteBtn.getAttribute("note")]
            rythmDefinition += note
        })
    })

    const saveObj = {
        title: rythmTitle,
        tempo: rythmTempo,
        notesInBar: notesInBar,
        barsInRow: barsInRow,
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
            sheet.dispatchEvent(new Event("rowadded", {
                row: row
            }))

            // Re-set sheet to the last sheet, so we edit the last sheet
            const allSheets = document.querySelectorAll(".sheet")
            sheet = allSheets[allSheets.length - 1]

            const firstBar = row.querySelector(".bar")
            bit = firstBar.firstChild
        }

        return bit.firstChild
    }

    const rythmDefinition = saveObj.rythm || []

    for (let i=0; i<rythmDefinition.length; i++) {
        let noteDef = rythmDefinition[i]
        
        let noteBtn = nextNote(previousNote)
        const bitBtn = noteBtn.parentNode

        switch (noteDef) {
        case "2":
            changeOneBitToDouble(bitBtn, false)
            break
        case "3":
            changeOneBitToTriplet(bitBtn, [], false)
            break
        case "g":
            changeOneBitToGrace(bitBtn, false)
            break
        case "-":
        case "B":
        case "T":
        case "S":
        case "G":
            const note = noteDefToNote[noteDef]
            setNoteForNoteBtn(noteBtn, note, false)
            previousNote = noteBtn
            break
        default:
            console.log(`Load error: unknown note definition: '${noteDef}'`)
        }
    }

    createAddRowBtnInSheet(sheet)
    
    // Check if maybe sheet is overflow, and fix it if needed
    onRowAdded(sheet)
}
