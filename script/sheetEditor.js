
// Global settings
let notesInBar = 4
let barsInRow = 4
let amountOfRows = 8


const setupBitBtnListeners = bitBtn => {
    bitBtn.addEventListener("mouseenter", () => {
        if (!selectedBits.includes(bitBtn)) {
            bitBtn.classList.add("selected")
            selectedBits.push(bitBtn)
        }
    })

    bitBtn.addEventListener("mouseleave", event => {
        if (!event.shiftKey) {
            deselectAllBits()
        }
    })

    bitBtn.addEventListener("click", () => {
        toggleNoteForBit(bitBtn)
    })
}


const createBitBtn = note => {
    const bitBtn = document.createElement("div")
    bitBtn.classList.add("bit")
    bitBtn.setAttribute("note", note)
    setupBitBtnListeners(bitBtn)

    const img = document.createElement("img")
    img.src = IMG_URLS[note]

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
    sheet.dispatchEvent(new Event("rowadded", {row: row}))
}

/**
 * Adds node to the new parent, at the end of the children list.
 * if asFirst set to True - adds at the beggining of the children list
 */
const reparentNode = (node, newParent, asFirst=false) => {
    
    if (asFirst && newParent.children.length > 0) {
        newParent.insertBefore(node, newParent.children[0])
    }else {
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

    console.log("overflow: ", overflow)

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
    console.log("Removed in ", sheet)

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
        sheet.dispatchEvent(new Event("rowadded", {row: row}))
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

const createTitleInSheet = (sheet, content) => {
    const title = document.createElement("h1")
    title.innerHTML = content
    sheet.appendChild(title)
}

const createTempoInSheet = (sheet, tempo) => {
    const tempoElement = document.createElement("p")
    tempoElement.classList.add("tempo")
    tempoElement.id = "tempo"

    tempoElement.innerHTML = tempo + " bmp"

    sheet.appendChild(tempoElement)
}

window.addEventListener("load", () => {
    const sheet = createEmptySheet()
    createTitleInSheet(sheet, "Title of your rythm")
    createTempoInSheet(sheet, 120)
    fillSheetWithEmptyRows(sheet, notesInBar, barsInRow, amountOfRows)
    createAddRowBtnInSheet(sheet)
})
