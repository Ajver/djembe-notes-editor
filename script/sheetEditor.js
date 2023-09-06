
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

const canFitMoreRows = (sheet) => {
    const firstSheet = Array.prototype.indexOf.call(sheet.parentNode.children, sheet) == 0
    const rowsCount = sheet.querySelectorAll(".row").length
    
    if (firstSheet) {
        return rowsCount < 10
    }else {
        return rowsCount < 11
    }
}

const onRowAdded = (sheet, row) => {
    console.log(sheet)
    if (!canFitMoreRows(sheet)) {
        sheet.classList.add("full")
    }
}

const createEmptySheet = (notesInBar, barsInRow, amountOfRows) => {
    const sheet = document.createElement("div")
    sheet.classList.add("sheet")

    const container = document.querySelector("#sheets-container")
    container.appendChild(sheet)

    sheet.addEventListener("rowadded", (event) => {
        onRowAdded(sheet, event.row)
    })

    for (let i = 0; i < amountOfRows; i++) {
        const row = createEmptyRow(sheet, notesInBar, barsInRow)
        sheet.appendChild(row)
        sheet.dispatchEvent(new Event("rowadded", {row: row}))
    }

    const addRowBtn = document.createElement("div")
    addRowBtn.classList.add("add-row-btn")
    addRowBtn.classList.add("editor-only")
    addRowBtn.addEventListener("click", () => {
        if (canFitMoreRows(sheet)) {
            createRowInSheet(sheet, notesInBar, barsInRow)
        }
    })

    sheet.appendChild(addRowBtn)
}

const deleteRowInSheet = (sheet, row) => {
    sheet.removeChild(row)
}

window.addEventListener("load", () => {
    createEmptySheet(notesInBar, barsInRow, amountOfRows)
})
