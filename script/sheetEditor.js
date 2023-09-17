// Global settings
let rythmTitle = "Title of your rythm"
let rythmTempo = 120
let partsInBeat = 1
let beatsInBar = 1
let barsInFullScore = 2
let amountOfFullScores = 1


const setupNoteBtnListeners = noteBtn => {
    noteBtn.addEventListener("mouseenter", () => {
        if (!selectedNotes.includes(noteBtn)) {
            selectNoteBtn(noteBtn)
        }
    })

    noteBtn.addEventListener("mouseleave", event => {
        if (!event.shiftKey) {
            deselectAllNotes()
        }
    })

    noteBtn.addEventListener("click", () => {
        toggleNoteForBeatPart(noteBtn)
    })

    noteBtn.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        setNoteForNoteBtn(noteBtn, "empty", false)
        return false
    })
}

const createNoteBtn = (note) => {
    const noteBtn = document.createElement("img")
    noteBtn.src = IMG_URLS[note]

    noteBtn.classList.add("note")

    noteBtn.setAttribute("note", note)
    setupNoteBtnListeners(noteBtn)

    noteBtn.ondragstart = () => {
        // Prevent dragging
        return false
    }

    return noteBtn
}

const createBeatPartBtn = note => {
    const beatPartBtn = document.createElement("div")
    beatPartBtn.classList.add("beat-part")
    beatPartBtn.setAttribute("beat-part-type", "single")

    const noteBtn = createNoteBtn(note)
    beatPartBtn.appendChild(noteBtn)
   
    return beatPartBtn
}

const createEmptyBeat = () => {
    const beat = document.createElement("div")
    beat.classList.add("beat")

    for (let i = 0; i < partsInBeat; i++) {
        const note = createBeatPartBtn("empty")
        beat.appendChild(note)
    }

    return beat
}

const createInjectFullScoreBeforeBtn = (fullScore) => {
    const btn = document.createElement("div")
    btn.classList.add("inject-full-score-before-btn")
    btn.classList.add("editor-only")

    btn.addEventListener("click", () => {
        // Always get parent from full score, because full score may be re-parented
        const parentSheet = fullScore.parentNode
        createFullScoreInSheetBeforeNode(parentSheet, fullScore)
    })

    return btn
}

const createDeleteFullScoreBtn = (fullScore) => {
    const btn = document.createElement("div")
    btn.classList.add("delete-full-score-btn")
    btn.classList.add("editor-only")

    btn.addEventListener("click", () => {
        deleteFullScore(fullScore)
    })

    return btn
}

const createEmptyBar = () => {
    const bar = document.createElement("div")
    bar.classList.add("bar")

    for (let j = 0; j < beatsInBar; j++) {
        const beat = createEmptyBeat()
        bar.appendChild(beat)
    }

    return bar
}

const clearFullScoresInSheet = (sheet) => {
    sheet.querySelectorAll(".fullscore").forEach(fullScore => {
        sheet.removeChild(fullScore)
    })
}

const createEmptyFullScore = (sheet) => {
    const fullScore = document.createElement("div")
    fullScore.classList.add("full-score")

    for (let i = 0; i < barsInFullScore; i++) {
        const bar = createEmptyBar()
        fullScore.appendChild(bar)
    }

    const injectFullScoreBeforeBtn = createInjectFullScoreBeforeBtn(fullScore)
    fullScore.appendChild(injectFullScoreBeforeBtn)

    const deleteFullScoreBtn = createDeleteFullScoreBtn(fullScore)
    fullScore.appendChild(deleteFullScoreBtn)

    return fullScore
}

const createFullScoreInSheetBeforeNode = (sheet, beforeNode) => {
    const fullScore = createEmptyFullScore()
    sheet.insertBefore(fullScore, beforeNode)
    sheet.dispatchEvent(new Event("fullscoreadded", {
        fullScore: fullScore
    }))
}

/**
 * Adds node to the new parent, at the end of the children list.
 * if asFirst set to True - adds at the beggining of the children list
 */
const reparentNode = (node, newParent, asFirst = false) => {
    if (asFirst && newParent.children.length > 0) {
        newParent.insertBefore(node, newParent.children[0])
    } else {
        newParent.appendChild(node)
    }
}

const isSheetOverflow = (sheet) => {
    const lastChild = sheet.lastChild

    if (!lastChild) {
        // No children found
        return false
    }

    const sheetTop = sheet.getBoundingClientRect().top
    const lastChildBottom = lastChild.getBoundingClientRect().bottom
    const offset = lastChildBottom - sheetTop

    if (offset > sheet.offsetHeight) {
        return true
    }

    return false
}

const moveElementToNextSheet = (sheet, element) => {
    const isThisLastSheet = sheet.parentNode.lastChild === sheet

    if (isThisLastSheet) {
        var nextSheet = createEmptySheet()
    }else {
        var nextSheet = sheet.nextSibling
    }

    reparentNode(element, nextSheet, true)
    fixSheetOverflow(nextSheet)
}

const fixSheetOverflow = (sheet) => {
    let overflow = isSheetOverflow(sheet)

    while (overflow) {
        const lastElement = sheet.lastChild
        moveElementToNextSheet(sheet, lastElement)
        overflow = isSheetOverflow(sheet)
    }
}

const onFullScoreAdded = (sheet) => {
    fixSheetOverflow(sheet)
}

const removeSheetIfEmpty = (sheet) => {
    if (sheet.children.length === 0) {
        sheet.parentNode.removeChild(sheet)
    }
}

const onFullScoreRemoved = (sheet) => {
    const isThisLastSheet = sheet.parentNode.lastChild === sheet

    if (isThisLastSheet) {
        // It's the last sheet, nothing to move
        removeSheetIfEmpty(sheet)
        return
    }

    const thisSheetIdx = Array.prototype.indexOf.call(sheet.parentNode.children, sheet)
    const nextSheet = sheet.parentNode.children[thisSheetIdx + 1]

    const firstElementOfNextSheet = nextSheet.firstChild

    if (!firstElementOfNextSheet) {
        // Next sheet is empty
        console.log("Next sheet is empty. Nothing to move!")
        removeSheetIfEmpty(sheet)
        return
    }

    // Move the first element of next sheet at the end of this sheet
    reparentNode(firstElementOfNextSheet, sheet)

    // Push event on the next sheet, so this moving flow can be recursively called on the next sheets
    nextSheet.dispatchEvent(new Event("fullscoreremoved"))
}

const deleteFullScore = (fullScore) => {
    const sheet = fullScore.parentNode
    sheet.removeChild(fullScore)
    sheet.dispatchEvent(new Event("fullscoreremoved"))
}

const getNextSheetId = () => {
    const allSheets = document.querySelectorAll(".sheet")
    return allSheets.length + 1
}

const createEmptySheet = () => {
    const sheet = document.createElement("div")
    sheet.classList.add("sheet")

    sheet.id = "sheet" + getNextSheetId()

    sheet.addEventListener("fullscoreadded", (event) => {
        onFullScoreAdded(sheet)
    })
    sheet.addEventListener("fullscoreremoved", (event) => {
        onFullScoreRemoved(sheet)
    })

    const container = document.querySelector("#sheets-container")
    container.appendChild(sheet)

    return sheet
}

const fillSheetWithEmptyFullRows = (sheet) => {
    for (let i = 0; i < amountOfFullScores; i++) {
        const bar = createEmptyFullScore()
        sheet.appendChild(bar)
        sheet.dispatchEvent(new Event("fullscoreadded", {
            bar: bar
        }))
    }
}

const createAddFullScoreBtnInSheet = (sheet) => {
    const addFullScoreBtn = document.createElement("div")
    addFullScoreBtn.classList.add("add-full-score-btn")
    addFullScoreBtn.classList.add("editor-only")
    addFullScoreBtn.addEventListener("click", () => {
        // Always get parent from btn, because button may be re-parented
        const parentSheet = addFullScoreBtn.parentNode
        createFullScoreInSheetBeforeNode(parentSheet, addFullScoreBtn)
    })

    sheet.appendChild(addFullScoreBtn)
}

const createInputLabel = (className, content, editCallback) => {
    const container = document.createElement("div")
    container.classList.add("input-label-container")
    container.classList.add(className)

    const label = document.createElement("p")
    label.innerHTML = content
    container.appendChild(label)

    const input = document.createElement("input")
    input.type = "text"
    input.value = content
    container.appendChild(input)

    container.addEventListener("click", () => {
        input.classList.add("visible")
        input.select()

        // Fixes bug when one can edit label with notes selected
        deselectAllNotes()
    })

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            input.blur()
        } else if (event.key === "Escape") {
            // Cancel editing
            input.value = rythmTitle
            input.blur()
        }
    })

    input.addEventListener("blur", () => {
        input.classList.remove("visible")

        const newContent = editCallback(input.value)
        if (newContent === undefined) {
            label.innerHTML = input.value
        }else {
            // Custom input content
            label.innerHTML = newContent
        }
    })

    return container
}

const createTitleInSheet = (sheet, content) => {
    const title = createInputLabel("title", rythmTitle, (newContent) => {
        rythmTitle = newContent
    })

    sheet.appendChild(title)
}

const createTempoInSheet = (sheet, tempo) => {
    const tempoElement = createInputLabel("tempo", rythmTempo + " bmp", (newContent) => {
        let newTempo = parseInt(newContent)

        if (isNaN(newTempo)) {
            // Invalid input
            return rythmTempo + " bpm"
        }

        if (newTempo < 10) {
            newTempo = 10
        }

        // Input valid - let's overrdie global settings
        rythmTempo = newTempo
        const tempoText = rythmTempo + " bpm"

        return tempoText
    })

    sheet.appendChild(tempoElement)
}

const createNewRythmWithGlobalSettings = () => {
    const sheet = createEmptySheet()
    createTitleInSheet(sheet, rythmTitle)
    createTempoInSheet(sheet, rythmTempo)
    fillSheetWithEmptyFullRows(sheet)
    createAddFullScoreBtnInSheet(sheet)
}

const clearAllSheets = () => {
    document.querySelectorAll(".sheet").forEach(sheet => {
        sheet.parentNode.removeChild(sheet)
    })
}

const loadDefaultSaveFile = async () => {
    const response = await fetch("defaultSaveFile.json")

    if (response.status === 200) {
        const jsonResponse = await response.text()
        loadFromTxt(jsonResponse)
    }else {
        console.log("Couldn't read default save file. Response: ", response)
    }
}

document.querySelector("#new-rythm-btn").addEventListener("click", () => {
    const modalContainer = document.querySelector("#create-rythm-modal-wrapper")
    modalContainer.classList.add("modal-visible")
    document.querySelector("body").classList.add("modal-visible")
})

const closeModal = () => {
    const modalContainer = document.querySelector("#create-rythm-modal-wrapper")
    modalContainer.classList.remove("modal-visible")
    document.querySelector("body").classList.remove("modal-visible")
}

document.querySelector("#close-create-rythm-modal-btn").addEventListener("click", () => {
    closeModal()
})

document.querySelector("#submit-create-rythm-btn").addEventListener("click", () => {
    const meterSelected = document.querySelector("input[name=preset-selection-btn]:checked").value

    const {
        notes,
        beats
    } = {
        "4-4": {
            notes: 4,
            beats: 4
        },
        "3-4": {
            notes: 4,
            beats: 3
        },
        "12-8": {
            notes: 3,
            beats: 4
        },
        "9-8": {
            notes: 3,
            beats: 3
        },
    } [meterSelected]

    // Override global settings, based on selected option
    partsInBeat = notes
    beatsInBar = beats

    barsInFullScore = document.querySelector("#bars-in-full-score-input").value
    barsInFullScore = Math.max(1, barsInFullScore)
    barsInFullScore = Math.min(10, barsInFullScore)

    clearAllSheets()

    createNewRythmWithGlobalSettings()

    closeModal()
})