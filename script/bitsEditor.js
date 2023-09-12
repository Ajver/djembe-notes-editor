
const IMG_URLS = {
    "empty": "svg/dash.svg",
    "bass": "svg/bass.svg",
    "tone": "svg/tone.svg",
    "slap": "svg/cross.svg",
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
    document.querySelectorAll(".bit").forEach((bitBtn) => {
        bitBtn.querySelectorAll("img").forEach((noteBtn) => {
            selectNoteBtn(noteBtn)
        })
    })
}

const getFirstNoteBtn = () => {
    const firstSheet = document.querySelector(".sheet")
    const firstRow = firstSheet.querySelector(".row")
    const firstBar = firstRow.firstChild
    const firstBit = firstBar.firstChild
    const firstNote = firstBit.firstChild
    return firstNote
}

const setNoteForNoteBtn = (noteBtn, note) => {
    noteBtn.setAttribute("note", note)
    noteBtn.src = IMG_URLS[note]
}

const setNoteForSelectedNoteBtns = note => {
    selectedNotes.forEach(noteBtn => {
        setNoteForNoteBtn(noteBtn, note)
    });
}

const toggleNoteForBit = bitBtn => {
    const currentNote = bitBtn.getAttribute("note")
    const nextNotes = {
        "empty": "bass",
        "bass": "tone",
        "tone": "slap",
        "slap": "empty",
    }
    const note = nextNotes[currentNote]
    setNoteForNoteBtn(bitBtn, note)
}

const getSelectedBits = () => {
    let bits = []

    selectedNotes.forEach(noteBtn => {
        const bit = noteBtn.parentNode
        if (bit && !bits.includes(bit)) {
            bits.push(bit)
        }
    })

    return bits
}

const changeOneBitToSingle = (bit) => {
    if (bit.getAttribute("bit-type") === "single") {
        // It's already single
        return
    }

    bit.setAttribute("bit-type", "single")

    // Showing next bit
    const nextBit = getNextBit(bit)
    if (nextBit) {
        nextBit.classList.remove("hidden")
    }

    let imgs = bit.querySelectorAll("img")
    
    // Remove extra imgs
    while(imgs.length > 1) {
        const lastImg = imgs[imgs.length - 1]
        bit.removeChild(lastImg)

        const selectedIdx = selectedNotes.indexOf(lastImg)
        if (selectedIdx > -1) {
            selectedNotes.splice(selectedIdx, 1)
        }

        imgs = bit.querySelectorAll("img")
    }
}

const changeBitsToSingle = () => {
    getSelectedBits().forEach(bit => {
        changeOneBitToSingle(bit)
    })
}

const changeOneBitToDouble = (bit, selectNewNotes) => {
    if (bit.getAttribute("bit-type") === "double") {
        // It's already double
        return
    }
    
    bit.setAttribute("bit-type", "double")

    // Showing next bit
    const nextBit = getNextBit(bit)
    if (nextBit) {
        nextBit.classList.remove("hidden")
    }

    let imgs = bit.querySelectorAll("img")
    
    // Add missing imgs
    while(imgs.length < 2) {
        const img = createNoteBtn("empty")
        bit.appendChild(img)

        if (selectNewNotes) {
            selectNoteBtn(img)
        }

        imgs = bit.querySelectorAll("img")
    }
    
    // Remove extra imgs
    while(imgs.length > 2) {
        const lastImg = imgs[imgs.length - 1]
        bit.removeChild(lastImg)

        const selectedIdx = selectedNotes.indexOf(lastImg)
        if (selectedIdx > -1) {
            selectedNotes.splice(selectedIdx, 1)
        }

        imgs = bit.querySelectorAll("img")
    }
}

const changeBitsToDouble = () => {
    getSelectedBits().forEach(bit => {
        changeOneBitToDouble(bit, true)   
    })
}

const indexOfElement = element => {
    const idx = Array.prototype.indexOf.call(element.parentNode.children, element)
    return idx
}

const getNextBit = (fromBit) => {
    if (fromBit.nextSibling) {
        return fromBit.nextSibling
    }

    const nextBar = fromBit.parentNode.nextSibling
    if (nextBar && nextBar.classList.contains("bar")) {
        return nextBar.firstChild
    }

    const nextRow = fromBit.parentNode.parentNode.nextSibling
    if (nextRow && nextRow.classList.contains("row")) {
        return nextRow.firstChild.firstChild
    }

    const nextSheet = fromBit.parentNode.parentNode.parentNode.nextSibling
    if (nextSheet && nextSheet.classList.contains("sheet")) {
        const row = nextSheet.querySelector(".row")
        if (row) {
            return row.firstChild.firstChild
        }
    }

    return null
}

const getPreviousBit = (fromBit) => {
    if (fromBit.previousSibling) {
        return fromBit.previousSibling
    }

    const prevBar = fromBit.parentNode.previousSibling
    if (prevBar && prevBar.classList.contains("bar")) {
        return prevBar.lastChild
    }

    const prevRow = fromBit.parentNode.parentNode.previousSibling
    if (prevRow && prevRow.classList.contains("row")) {
        // -2, because the last node in bar is DeleteRow btn
        const allBars = prevRow.querySelectorAll(".bar")
        return allBars[allBars.length - 1].lastChild
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

    // This bit doesn't have anymore notes
    // ...let's get next bit
    var bit = getNextBit(fromNote.parentNode)
    if (bit) {
        return bit.firstChild
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

    // This bit doesn't have anymore notes
    // ...let's get next bit
    var bit = getPreviousBit(fromNote.parentNode)
    if (bit) {
        return bit.lastChild
    }

    return null
}

const calculateBitNumber = (bit) => {
    const bar = bit.parentNode
    const row = bar.parentNode
    const sheet = row.parentNode
    
    const bitIdx = indexOfElement(bit)
    const barIdx = indexOfElement(bar)
    const rowIdx = indexOfElement(row)
    const sheetIdx = indexOfElement(sheet)

    const bitNumber = (
        sheetIdx * 10000 +
        rowIdx * 1000 +
        barIdx * 100 +
        bitIdx * 10
    )
    return bitNumber
}

const calculateNoteNumber = (noteBtn) => {
    const bitNumber = calculateBitNumber(noteBtn.parentNode)
    const noteIdx = indexOfElement(noteBtn)
    const noteNumber = bitNumber + noteIdx
    return noteNumber
} 

const changeOneBitToTriplet = (bit, hiddenBits, selectNewNotes) => {
    if (bit.getAttribute("bit-type") === "triplet") {
        // It's already triplet
        return
    }

    if (hiddenBits.includes(bit)) {
        // This bit was hidden - let's ignore it
        return
    }
    
    bit.setAttribute("bit-type", "triplet")

    // Hiding next bit
    const nextBit = getNextBit(bit)
    if (nextBit) {
        nextBit.classList.add("hidden")
        hiddenBits.push(nextBit)

        if (nextBit.getAttribute("bit-type") === "triplet") {
            // It's triplet! (Which means it hides following bit)
            // Let's change it to single bit type, to avoid issues
            // and edge cases with chained triplets
            changeOneBitToSingle(nextBit)
        }
    }

    let imgs = bit.querySelectorAll("img")
    
    // Add missing imgs
    while(imgs.length < 3) {
        const img = createNoteBtn("empty")
        bit.appendChild(img)

        if (selectNewNotes) {
            selectNoteBtn(img)
        }

        imgs = bit.querySelectorAll("img")
    }
}

const changeBitsToTriplets = () => {
    
    /**This function changes to triplets some bits, and then hides the next
     * bit, because triplet covers two bits. So if bit A is changed into triple, 
     * bit B is hidden.
     * 
     * Then, even if bit B is selected, it is NOT changed to triplet! 
     */

    const selectedBits = getSelectedBits()

    selectedBits.sort((bitA, bitB) => {
        const bitANumber = calculateBitNumber(bitA)
        const bitBNumber = calculateBitNumber(bitB)

        return bitANumber - bitBNumber
    })

    let hiddenBits = []

    selectedBits.forEach(bit => {
        changeOneBitToTriplet(bit, hiddenBits, true)
    })
}

const sortSelectedNotes = () => {
    selectedNotes.sort((noteA, noteB) => {
        const noteANumber = calculateBitNumber(noteA)
        const noteBNumber = calculateBitNumber(noteB)

        return noteANumber - noteBNumber
    })
}

const copyBits = () => {
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

const cutBits = async () => {
    copyBits()
    setNoteForSelectedNoteBtns("empty")
}

const pasteBits = async () => {
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

        setNoteForNoteBtn(noteBtn, note)

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
            // Just selected hidden bit - let's try to select yet previous one
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
            // Just selected hidden bit - let's try to select yet next one
            moveSelectionRight()
        }
    }
}

addEventListener("keydown", event => {
    if (document.querySelector("body").classList.contains("modal-visible")) {
        return
    }

    const keyHandler = {
        "`": () => setNoteForSelectedNoteBtns("empty"),
        "1": () => setNoteForSelectedNoteBtns("bass"),
        "2": () => setNoteForSelectedNoteBtns("tone"),
        "3": () => setNoteForSelectedNoteBtns("slap"),
        // Shift + 1
        "!": () => changeBitsToSingle(),
        // Shift + 2
        "@": () => changeBitsToDouble(),
        // Shift + 3
        "#": () => changeBitsToTriplets(),
        "c": () => {
            if (event.ctrlKey || event.metaKey) {
                copyBits()
            }
        },
        "v": () => {
            if (event.ctrlKey || event.metaKey) {
                pasteBits()
            }
        },
        "x": () => {
            if (event.ctrlKey || event.metaKey) {
                cutBits()
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