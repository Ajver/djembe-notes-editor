// Global settings
let rythmTitle = "Title of your rythm"
let rythmTempo = 120
let notesInBar = 4
let barsInRow = 4
let amountOfRows = 4


const setupNoteBtnListeners = noteBtn => {
    noteBtn.addEventListener("mouseenter", () => {
        if (!selectedNotes.includes(noteBtn)) {
            noteBtn.classList.add("selected")
            selectedNotes.push(noteBtn)
        }
    })

    noteBtn.addEventListener("mouseleave", event => {
        if (!event.shiftKey) {
            deselectAllNotes()
        }
    })

    noteBtn.addEventListener("click", () => {
        toggleNoteForBit(noteBtn)
    })

    noteBtn.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        setNoteForNoteBtn(noteBtn, "empty")
        return false
    })
}

const createNoteBtn = (note) => {
    const img = document.createElement("img")
    img.src = IMG_URLS[note]

    img.setAttribute("note", note)
    setupNoteBtnListeners(img)

    img.ondragstart = () => {
        // Prevent dragging
        return false
    }

    return img
}

const createBitBtn = note => {
    const bitBtn = document.createElement("div")
    bitBtn.classList.add("bit")
    bitBtn.setAttribute("bit-type", "single")

    const img = createNoteBtn(note)
    bitBtn.appendChild(img)
   
    return bitBtn
}

const createEmptyBar = notesInBar => {
    const bar = document.createElement("div")
    bar.classList.add("bar")

    for (let i = 0; i < notesInBar; i++) {
        const note = createBitBtn("empty")
        bar.appendChild(note)
    }

    return bar
}

const createDeleteRowBtn = (row) => {
    const btn = document.createElement("div")
    btn.classList.add("delete-row-btn")
    btn.classList.add("editor-only")

    btn.addEventListener("click", () => {
        deleteRow(row)
    })

    return btn
}

const createEmptyRow = (notesInBar, barsInRow) => {
    const row = document.createElement("div")
    row.classList.add("row")

    for (let j = 0; j < barsInRow; j++) {
        const bar = createEmptyBar(notesInBar)
        row.appendChild(bar)
    }

    const deleteRowBtn = createDeleteRowBtn(row)
    row.appendChild(deleteRowBtn)

    return row
}

const clearRowsInSheet = (sheet) => {
    sheet.querySelectorAll(".row").forEach(row => {
        sheet.removeChild(row)
    })
}

const createRowInSheet = (sheet, notesInBar, barsInRow) => {
    const row = createEmptyRow(notesInBar, barsInRow)
    const addRowBtn = sheet.lastChild
    sheet.insertBefore(row, addRowBtn)
    sheet.dispatchEvent(new Event("rowadded", {
        row: row
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
        const nextSheet = createEmptySheet()
        reparentNode(element, nextSheet, true)
    }
}

const onRowAdded = (sheet) => {
    const overflow = isSheetOverflow(sheet)

    if (overflow) {
        const lastElement = sheet.lastChild
        moveElementToNextSheet(sheet, lastElement)
    }
}

const removeSheetIfEmpty = (sheet) => {
    if (sheet.children.length === 0) {
        sheet.parentNode.removeChild(sheet)
    }
}

const onRowRemoved = (sheet) => {
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
    nextSheet.dispatchEvent(new Event("rowremoved"))
}

const deleteRow = (row) => {
    const sheet = row.parentNode
    sheet.removeChild(row)
    sheet.dispatchEvent(new Event("rowremoved"))
}


const getNextSheetId = () => {
    const allSheets = document.querySelectorAll(".sheet")
    return allSheets.length + 1
}

const createEmptySheet = () => {
    const sheet = document.createElement("div")
    sheet.classList.add("sheet")

    sheet.id = "sheet" + getNextSheetId()

    sheet.addEventListener("rowadded", (event) => {
        onRowAdded(sheet)
    })
    sheet.addEventListener("rowremoved", (event) => {
        onRowRemoved(sheet)
    })

    const container = document.querySelector("#sheets-container")
    container.appendChild(sheet)

    return sheet
}

const fillSheetWithEmptyRows = (sheet, notesInBar, barsInRow, amountOfRows) => {
    for (let i = 0; i < amountOfRows; i++) {
        const row = createEmptyRow(notesInBar, barsInRow)
        sheet.appendChild(row)
        sheet.dispatchEvent(new Event("rowadded", {
            row: row
        }))
    }
}

const createAddRowBtnInSheet = (sheet) => {
    const addRowBtn = document.createElement("div")
    addRowBtn.classList.add("add-row-btn")
    addRowBtn.classList.add("editor-only")
    addRowBtn.addEventListener("click", () => {
        // Always get parent from btn, because button may be re-parented
        const parentSheet = addRowBtn.parentNode
        createRowInSheet(parentSheet, notesInBar, barsInRow)
    })

    sheet.appendChild(addRowBtn)
}

const createInputLabel = (className, content, editCallback) => {
    const container = document.createElement("div")
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
        label.innerHTML = input.value
        editCallback(input.value)
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
    const tempoElement = document.createElement("p")
    tempoElement.classList.add("tempo")
    tempoElement.id = "tempo"

    tempoElement.innerHTML = tempo + " bmp"

    sheet.appendChild(tempoElement)
}

const createNewRythmWithGlobalSettings = () => {
    const sheet = createEmptySheet()
    createTitleInSheet(sheet, rythmTitle)
    createTempoInSheet(sheet, rythmTempo)
    fillSheetWithEmptyRows(sheet, notesInBar, barsInRow, amountOfRows)
    createAddRowBtnInSheet(sheet)
}

const clearAllSheets = () => {
    document.querySelectorAll(".sheet").forEach(sheet => {
        sheet.parentNode.removeChild(sheet)
    })
}

window.addEventListener("load", () => {
    createNewRythmWithGlobalSettings()
})

document.querySelector("#new-rythm-btn").addEventListener("click", () => {
    const modalContainer = document.querySelector("#create-rythm-modal-wrapper")
    modalContainer.classList.add("modal-visible")
})

const closeModal = () => {
    const modalContainer = document.querySelector("#create-rythm-modal-wrapper")
    modalContainer.classList.remove("modal-visible")
}

document.querySelector("#close-create-rythm-modal-btn").addEventListener("click", () => {
    closeModal()
})

document.querySelector("#submit-create-rythm-btn").addEventListener("click", () => {
    const meterSelected = document.querySelector("input[name=preset-selection-btn]:checked").value

    const {
        notes,
        bars
    } = {
        "4-4": {
            notes: 4,
            bars: 4
        },
        "3-4": {
            notes: 4,
            bars: 3
        },
        "12-8": {
            notes: 3,
            bars: 4
        },
        "9-8": {
            notes: 3,
            bars: 3
        },
    } [meterSelected]

    // Override global settings, based on selected option
    notesInBar = notes
    barsInRow = bars

    clearAllSheets()

    createNewRythmWithGlobalSettings()

    closeModal()
})