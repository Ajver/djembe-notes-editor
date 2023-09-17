
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
    let rythmDefinition = ""

    document.querySelectorAll(".beat-part").forEach((beatPartBtn) => {
        const beatPartType = beatPartBtn.getAttribute("beat-part-type")
        const typeDef = beatPartTypeToDef[beatPartType]
        rythmDefinition += typeDef

        beatPartBtn.querySelectorAll("img").forEach((noteBtn) => {
            const note = noteToNoteDef[noteBtn.getAttribute("note")]
            rythmDefinition += note
        })
    })

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

    let previousNote = null

    const nextNote = (fromNote) => {
        /**
         * This function returns next note. If there are no more notes,
         * it creates new bar
         */

        if (fromNote) {
            if (fromNote.nextSibling) {
                // Let's return the next child
                return fromNote.nextSibling
            }

            // This beatPart doesn't have anymore notes
            // ...let's get next beatPart
            var beatPart = getNextBeatPart(fromNote.parentNode)
        }else {
            // We don't get "fromNote", but maybe we can return the first note?
            const firstNote = getFirstNoteBtn()

            if (firstNote) {
                return firstNote
            }

            // Looks like there is no "firstNote" - let's mark beat part as None, so the new bar gets created
            var beatPart = null
        }

        if (!beatPart) {
            // There are no more beatParts - let's create a new bar
            const fullScore = createEmptyFullScore()
            sheet.appendChild(fullScore)
            sheet.dispatchEvent(new Event("fullscoreadded", {
                fullScore: fullScore
            }))

            // Re-set sheet to the last sheet, so we edit the last sheet
            const allSheets = document.querySelectorAll(".sheet")
            sheet = allSheets[allSheets.length - 1]

            const firstBeat = fullScore.querySelector(".beat")
            beatPart = firstBeat.firstChild
        }

        return beatPart.firstChild
    }

    const rythmDefinition = saveObj.rythm || []

    for (let i=0; i<rythmDefinition.length; i++) {
        let noteDef = rythmDefinition[i]
        
        let noteBtn = nextNote(previousNote)
        const beatPartBtn = noteBtn.parentNode

        switch (noteDef) {
        case "2":
            changeOneBeatPartToDouble(beatPartBtn, false)
            break
        case "3":
            changeOneBeatPartToTriplet(beatPartBtn, [], false)
            break
        case "g":
            changeOneBeatPartToGrace(beatPartBtn, false)
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

    createAddFullScoreBtnInSheet(sheet)
    
    // Check if maybe sheet is overflow, and fix it if needed
    fixSheetOverflow(sheet)
}
