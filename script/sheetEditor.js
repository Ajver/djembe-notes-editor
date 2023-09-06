
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

const clearSheet = () => {
    const sheet = document.querySelector("#sheet")
    sheet.innerHTML = ""
}

const createRowInSheet = (sheet, notesInBar, barsInRow) => {
    const row = createEmptyRow(notesInBar, barsInRow)
    const addRowBtn = sheet.lastChild
    sheet.insertBefore(row, addRowBtn)
}

const createEmptySheet = (notesInBar, barsInRow, amountOfRows) => {
    clearSheet()

    const sheet = document.querySelector("#sheet")

    for (let i = 0; i < amountOfRows; i++) {
        const row = createEmptyRow(notesInBar, barsInRow)
        sheet.appendChild(row)
    }

    const addRowBtn = document.createElement("div")
    addRowBtn.classList.add("add-row-btn")
    addRowBtn.classList.add("editor-only")
    addRowBtn.addEventListener("click", () => {
        createRowInSheet(sheet, notesInBar, barsInRow)
    })

    sheet.appendChild(addRowBtn)
}

const deleteRow = (row) => {
    const sheet = document.querySelector("#sheet")
    sheet.removeChild(row)
}

window.addEventListener("load", () => {
    createEmptySheet(4, 4, 2)
})
