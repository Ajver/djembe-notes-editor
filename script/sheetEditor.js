
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

const createDeleteRowBtn = (sheet, row) => {
    const btn = document.createElement("div")
    btn.classList.add("delete-row-btn")
    btn.classList.add("editor-only")

    btn.addEventListener("click", () => {
        deleteRowInSheet(sheet, row)
    })

    return btn
}

const createEmptyRow = (sheet, notesInBar, barsInRow) => {
    const row = document.createElement("div")
    row.classList.add("row")

    for (let j = 0; j < barsInRow; j++) {
        const bar = createEmptyBar(notesInBar)
        row.appendChild(bar)
    }

    const deleteRowBtn = createDeleteRowBtn(sheet, row)
    row.appendChild(deleteRowBtn)

    return row
}

const clearRowsInSheet = (sheet) => {
    sheet.querySelectorAll(".row").forEach(row => {
        sheet.removeChild(row)
    })
}

const createRowInSheet = (sheet, notesInBar, barsInRow) => {
    const row = createEmptyRow(sheet, notesInBar, barsInRow)
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

const canFitMoreRows = (sheet) => {
    const firstSheet = Array.prototype.indexOf.call(sheet.parentNode.children, sheet) == 0
    const rowsCount = sheet.querySelectorAll(".row").length
    
    if (firstSheet) {
        return rowsCount < 10
    }else {
        return rowsCount < 11
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
    console.log("Is overflow: ", overflow)

    if (overflow) {
        const lastElement = sheet.lastChild
        moveElementToNextSheet(sheet, lastElement)
    }
}

const onRowRemoved = (sheet) => {
    const overflow = isSheetOverflow(sheet)
    console.log("Is overflow: ", overflow)
}

const deleteRowInSheet = (sheet, row) => {
    sheet.removeChild(row)
    sheet.dispatchEvent(new Event("rowremoved"))
}


const getNextSheetId = () => {
    const allSheets = document.querySelectorAll(".sheet")
    return allSheets.length + 1
}

const createEmptySheet = (notesInBar, barsInRow, amountOfRows) => {
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
        const row = createEmptyRow(sheet, notesInBar, barsInRow)
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

window.addEventListener("load", () => {
    const sheet = createEmptySheet()
    fillSheetWithEmptyRows(sheet, notesInBar, barsInRow, amountOfRows)
    createAddRowBtnInSheet(sheet)
})
