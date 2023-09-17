
const IMG_URLS = {
    "empty": "svg/dash.svg",
    "bass": "svg/bass.svg",
    "tone": "svg/tone.svg",
    "slap": "svg/cross.svg",
    "ghost": "svg/ghost.svg",
}

let selectedNotes = []

const selectNoteBtn = (noteBtn) => {
    noteBtn.classList.add("selected")
    selectedNotes.push(noteBtn)
}

const deselectAllNotes = () => {
    selectedNotes.forEach(noteBtn => {
        noteBtn.classList.remove("selected")
    })

    selectedNotes = []
}

const selectAllNotes = () => {
    document.querySelectorAll(".beat-part").forEach((beatPartBtn) => {
        beatPartBtn.querySelectorAll(".note").forEach((noteBtn) => {
            selectNoteBtn(noteBtn)
        })
    })
}

const getFirstNoteBtn = () => {
    const firstSheet = document.querySelector(".sheet")
    if (!firstSheet) return null
    
    const firstBar = firstSheet.querySelector(".bar")
    if (!firstBar) return null

    const firstBeat = firstBar.querySelector(".beat")
    if (!firstBeat) return null

    const firstBeatPart = firstBeat.querySelector(".beat-part")
    if (!firstBeatPart) return null

    const firstNote = firstBeatPart.querySelector(".note")
    return firstNote
}

const setNoteForNoteBtn = (noteBtn, note, play) => {
    noteBtn.setAttribute("note", note)
    noteBtn.src = IMG_URLS[note]
    
    if (play) {
        playNoteBtn(noteBtn)
    }
}

const setNoteForSelectedNoteBtns = note => {
    selectedNotes.forEach(noteBtn => {
        setNoteForNoteBtn(noteBtn, note, false)
    });

    if (selectedNotes.length > 0) {
        playNoteBtn(selectedNotes[0])
    }
}

const toggleNoteForBeatPart = beatPartBtn => {
    const currentNote = beatPartBtn.getAttribute("note")
    const nextNotes = {
        "empty": "bass",
        "bass": "tone",
        "tone": "slap",
        "slap": "ghost",
        "ghost": "empty",
    }
    const note = nextNotes[currentNote]
    setNoteForNoteBtn(beatPartBtn, note, true)
}

const getSelectedBeatParts = () => {
    let beatParts = []

    selectedNotes.forEach(noteBtn => {
        const beatPart = noteBtn.parentNode
        if (beatPart && !beatParts.includes(beatPart)) {
            beatParts.push(beatPart)
        }
    })

    return beatParts
}

const addOrRemoveExtraNoteBtns = (beatPart, selectNewNotes) => {
    const expectedNotesCount = {
        "single": 1,
        "double": 2,
        "triplet": 3,
        "grace": 2,
    } [beatPart.getAttribute("beat-part-type")]

    let noteBtns = beatPart.querySelectorAll(".note")
    
    // Add missing noteBtns
    while(noteBtns.length < expectedNotesCount) {
        const noteBtn = createNoteBtn("empty")
        beatPart.appendChild(noteBtn)

        if (selectNewNotes) {
            selectNoteBtn(noteBtn)
        }

        noteBtns = beatPart.querySelectorAll(".note")
    }

    // Remove extra noteBtns
    while(noteBtns.length > expectedNotesCount) {
        const lastImg = noteBtns[noteBtns.length - 1]
        beatPart.removeChild(lastImg)

        const selectedIdx = selectedNotes.indexOf(lastImg)
        if (selectedIdx > -1) {
            selectedNotes.splice(selectedIdx, 1)
        }

        noteBtns = beatPart.querySelectorAll(".note")
    }
}

const changeOneBeatPartToSingle = (beatPart) => {
    if (beatPart.getAttribute("beat-part-type") === "single") {
        // It's already single
        return
    }

    beatPart.setAttribute("beat-part-type", "single")

    // Showing next beatPart
    const nextBeatPart = getNextBeatPart(beatPart)
    if (nextBeatPart) {
        nextBeatPart.classList.remove("hidden")
    }

    addOrRemoveExtraNoteBtns(beatPart)
}

const changeBeatPartsToSingle = () => {
    getSelectedBeatParts().forEach(beatPart => {
        changeOneBeatPartToSingle(beatPart)
    })
}

const changeOneBeatPartToDouble = (beatPart, selectNewNotes) => {
    if (beatPart.getAttribute("beat-part-type") === "double") {
        // It's already double
        return
    }
    
    beatPart.setAttribute("beat-part-type", "double")

    // Showing next beatPart
    const nextBeatPart = getNextBeatPart(beatPart)
    if (nextBeatPart) {
        nextBeatPart.classList.remove("hidden")
    }

    addOrRemoveExtraNoteBtns(beatPart, selectNewNotes)
}

const changeBeatPartsToDouble = () => {
    getSelectedBeatParts().forEach(beatPart => {
        changeOneBeatPartToDouble(beatPart, true)   
    })
}

const indexOfElement = element => {
    const idx = Array.prototype.indexOf.call(element.parentNode.children, element)
    return idx
}

const getNextBeatPart = (fromBeatPart) => {
    if (fromBeatPart.nextSibling) {
        return fromBeatPart.nextSibling
    }

    const beat = fromBeatPart.parentNode
    const nextBeat = beat.nextSibling
    if (nextBeat && nextBeat.classList.contains("beat")) {
        return nextBeat.firstChild
    }

    const bar = beat.parentNode
    const nextBar = bar.nextSibling
    if (nextBar && nextBar.classList.contains("bar")) {
        return nextBar.querySelector(".beat-part")
    }

    const fullScore = bar.parentNode
    const nextFullScore = fullScore.nextSibling
    if (nextFullScore && nextFullScore.classList.contains("full-score")) {
        return nextFullScore.querySelector(".beat-part")
    }

    const sheet = fullScore.parentNode
    const nextSheet = sheet.nextSibling
    if (nextSheet && nextSheet.classList.contains("sheet")) {
        return nextSheet.querySelector(".beat-part")
    }

    return null
}

const getPreviousBeatPart = (fromBeatPart) => {
    if (fromBeatPart.previousSibling) {
        return fromBeatPart.previousSibling
    }

    const beat = fromBeatPart.parentNode
    const prevBeat = beat.previousSibling
    if (prevBeat && prevBeat.classList.contains("beat")) {
        return prevBeat.lastChild
    }

    const bar = beat.parentNode
    const prevBar = bar.previousSibling
    if (prevBar && prevBar.classList.contains("bar")) {
        const allBeatParts = prevBar.querySelectorAll(".beat-part")
        return allBeatParts[allBeatParts.length - 1]
    }

    const fullScore = bar.parentNode
    const prevFullScore = fullScore.previousSibling
    if (prevFullScore && prevFullScore.classList.contains("full-score")) {
        const allBeatParts = prevFullScore.querySelectorAll(".beat-part")
        return allBeatParts[allBeatParts.length - 1]
    }

    const sheet = fullScore.parentNode
    const prevSheet = sheet.previousSibling
    if (prevSheet && prevSheet.nodeType === Node.ELEMENT_NODE && prevSheet.classList.contains("sheet")) {
        const allBeatParts = prevSheet.querySelectorAll(".beat-part")
        return allBeatParts[allBeatParts.length - 1]
    }

    return null
}

const getNextNoteBtn = (fromNote) => {
    if (!fromNote) {
        const firstNote = getFirstNoteBtn()
        return firstNote
    }

    if (fromNote.nextSibling) {
        // Let's return the next child
        return fromNote.nextSibling
    }

    // This beatPart doesn't have anymore notes
    // ...let's get next beatPart
    var beatPart = getNextBeatPart(fromNote.parentNode)
    if (beatPart) {
        return beatPart.firstChild
    }

    return null
}

const getPreviousNoteBtn = (fromNote) => {
    if (!fromNote) {
        return null
    }

    if (fromNote.previousSibling) {
        // Let's return the previous child
        return fromNote.previousSibling
    }

    // This beatPart doesn't have anymore notes
    // ...let's get next beatPart
    var beatPart = getPreviousBeatPart(fromNote.parentNode)
    if (beatPart) {
        return beatPart.lastChild
    }

    return null
}

const getBeatPartNumberDetails = (beatPart) => {
    const beat = beatPart.parentNode
    const bar = beat.parentNode
    const sheet = bar.parentNode
    
    const beatPartIdx = indexOfElement(beatPart)
    const beatIdx = indexOfElement(beat)
    const barIdx = indexOfElement(bar)
    const sheetIdx = indexOfElement(sheet)

    const details = {
        beatPartIdx: beatPartIdx,
        beatIdx: beatIdx,
        barIdx: barIdx,
        sheetIdx: sheetIdx,
    }

    return details
}

const getNoteNumberDetails = (noteBtn) => {
    const beatPart = noteBtn.parentNode
    const beatPartDetails = getBeatPartNumberDetails(beatPart)

    const noteIdx = indexOfElement(noteBtn)

    const noteDetails = {
        ...beatPartDetails,
        noteIdx: noteIdx,
    }

    console.log("note details:", noteDetails)

    return noteDetails
}

const calculateBeatPartNumber = (beatPart) => {
    const details = getBeatPartNumberDetails(beatPart)

    const beatPartNumber = (
        details.sheetIdx * 10000 +
        details.barIdx * 1000 +
        details.beatIdx * 100 +
        details.beatPartIdx * 10
    )
    return beatPartNumber
}

const calculateNoteNumber = (noteBtn) => {
    const beatPartNumber = calculateBeatPartNumber(noteBtn.parentNode)
    const noteIdx = indexOfElement(noteBtn)
    const noteNumber = beatPartNumber + noteIdx
    return noteNumber
} 

const changeOneBeatPartToTriplet = (beatPart, hiddenBeatParts, selectNewNotes) => {
    if (beatPart.getAttribute("beat-part-type") === "triplet") {
        // It's already triplet
        return
    }

    if (hiddenBeatParts.includes(beatPart)) {
        // This beatPart was hidden - let's ignore it
        return
    }
    
    beatPart.setAttribute("beat-part-type", "triplet")

    // Hiding next beatPart
    const nextBeatPart = getNextBeatPart(beatPart)
    if (nextBeatPart) {
        nextBeatPart.classList.add("hidden")
        hiddenBeatParts.push(nextBeatPart)

        if (nextBeatPart.getAttribute("beat-part-type") === "triplet") {
            // It's triplet! (Which means it hides following beatPart)
            // Let's change it to single beatPart type, to avoid issues
            // and edge cases with chained triplets
            changeOneBeatPartToSingle(nextBeatPart)
        }
    }

    addOrRemoveExtraNoteBtns(beatPart, selectNewNotes)
}

const changeBeatPartsToTriplets = () => {
    
    /**This function changes to triplets some beatParts, and then hides the next
     * beatPart, because triplet covers two beatParts. So if beatPart A is changed into triple, 
     * beatPart B is hidden.
     * 
     * Then, even if beatPart B is selected, it is NOT changed to triplet! 
     */

    const selectedBeatParts = getSelectedBeatParts()

    selectedBeatParts.sort((beatPartA, beatPartB) => {
        const beatPartANumber = calculateBeatPartNumber(beatPartA)
        const beatPartBNumber = calculateBeatPartNumber(beatPartB)

        return beatPartANumber - beatPartBNumber
    })

    let hiddenBeatParts = []

    selectedBeatParts.forEach(beatPart => {
        changeOneBeatPartToTriplet(beatPart, hiddenBeatParts, true)
    })
}

const changeOneBeatPartToGrace = (beatPart, selectNewNotes) => {
    if (beatPart.getAttribute("beat-part-type") === "grace") {
        // It's already grace
        return
    }
    
    beatPart.setAttribute("beat-part-type", "grace")

    // Showing next beatPart
    const nextBeatPart = getNextBeatPart(beatPart)
    if (nextBeatPart) {
        nextBeatPart.classList.remove("hidden")
    }

    addOrRemoveExtraNoteBtns(beatPart, selectNewNotes)
}

const changeBeatPartsToGrace = () => {
    getSelectedBeatParts().forEach(beatPart => {
        changeOneBeatPartToGrace(beatPart, true)
    })
}

const sortSelectedNotes = () => {
    selectedNotes.sort((noteA, noteB) => {
        const noteANumber = calculateBeatPartNumber(noteA)
        const noteBNumber = calculateBeatPartNumber(noteB)

        return noteANumber - noteBNumber
    })
}

const copyNotes = () => {
    if (selectedNotes.length == 0) {
        return
    }
    
    sortSelectedNotes()

    let copyText = ""
    selectedNotes.forEach((noteBtn) => {
        const note = noteToNoteDef[noteBtn.getAttribute("note")]
        copyText += note
    })

    navigator.clipboard.writeText(copyText)
    console.log("Copying", copyText)
}

const cutNotes = async () => {
    copyNotes()
    setNoteForSelectedNoteBtns("empty")
}

const pasteNotes = async () => {
    if (selectedNotes.length == 0) {
        return
    }

    sortSelectedNotes()

    const copyText = await navigator.clipboard.readText()

    let noteBtn = selectedNotes[0]
    let i = 0

    while(noteBtn && i < copyText.length) { 
        const noteDef = copyText[i]
        const note = noteDefToNote[noteDef]

        setNoteForNoteBtn(noteBtn, note, false)

        noteBtn = getNextNoteBtn(noteBtn)
        i++
    }

    console.log("Pasting", copyText)
}

const moveSelectionLeft = () => {
    if (selectedNotes.length == 0) {
        return
    }

    sortSelectedNotes()

    const noteBtn = selectedNotes[0]
    const previousNoteBtn = getPreviousNoteBtn(noteBtn)

    if (previousNoteBtn) {
        deselectAllNotes()
        selectNoteBtn(previousNoteBtn)

        if (previousNoteBtn.parentNode.classList.contains("hidden")) {
            // Just selected hidden beatPart - let's try to select yet previous one
            moveSelectionLeft()
        }
    }
}

const moveSelectionRight = () => {
    if (selectedNotes.length == 0) {
        const noteBtn = getFirstNoteBtn()
        selectNoteBtn(noteBtn)
        return
    }

    sortSelectedNotes()

    const noteBtn = selectedNotes[0]
    const nextNoteBtn = getNextNoteBtn(noteBtn)

    if (nextNoteBtn) {
        deselectAllNotes()
        selectNoteBtn(nextNoteBtn)

        if (nextNoteBtn.parentNode.classList.contains("hidden")) {
            // Just selected hidden beatPart - let's try to select yet next one
            moveSelectionRight()
        }
    }
}

addEventListener("keydown", event => {
    if (document.querySelector("body").classList.contains("modal-visible")) {
        return
    }

    if (isPlayingRythm) {
        return
    }

    const keyHandler = {
        "`": () => setNoteForSelectedNoteBtns("empty"),
        "1": () => setNoteForSelectedNoteBtns("bass"),
        "2": () => setNoteForSelectedNoteBtns("tone"),
        "3": () => setNoteForSelectedNoteBtns("slap"),
        "4": () => setNoteForSelectedNoteBtns("ghost"),
        // Shift + 1
        "!": () => changeBeatPartsToSingle(),
        // Shift + 2
        "@": () => changeBeatPartsToDouble(),
        // Shift + 3
        "#": () => changeBeatPartsToTriplets(),
        // Shift + 4
        "$": () => changeBeatPartsToGrace(),
        "c": () => {
            if (event.ctrlKey || event.metaKey) {
                copyNotes()
            }
        },
        "v": () => {
            if (event.ctrlKey || event.metaKey) {
                pasteNotes()
            }
        },
        "x": () => {
            if (event.ctrlKey || event.metaKey) {
                cutNotes()
            }
        },
        "a": () => {
            if (event.ctrlKey || event.metaKey) {
                selectAllNotes()
                event.preventDefault()
            }
        },
        "Escape": () => deselectAllNotes(),
        "ArrowLeft": () => moveSelectionLeft(),
        "ArrowRight": () => moveSelectionRight(),
    }

    handler = keyHandler[event.key]
    if (handler) {
        handler()
    }else {
        console.log(event)
    }
});