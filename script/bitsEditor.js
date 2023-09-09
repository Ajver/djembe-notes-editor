
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

    // Hiding next bit
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

const changeOneBitToDouble = (bit) => {
    if (bit.getAttribute("bit-type") === "double") {
        // It's already double
        return
    }
    
    bit.setAttribute("bit-type", "double")

    // Hiding next bit
    const nextBit = getNextBit(bit)
    if (nextBit) {
        nextBit.classList.remove("hidden")
    }

    let imgs = bit.querySelectorAll("img")
    
    // Add missing imgs
    while(imgs.length < 2) {
        const img = createNoteBtn("empty")
        bit.appendChild(img)
        selectNoteBtn(img)
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
        changeOneBitToDouble(bit)   
    })
}

const indexOfElement = element => {
    const idx = Array.prototype.indexOf.call(element.parentNode.children, element)
    return idx
}

const getNextBit = (fromBit) => {
    const parent = fromBit.parentNode
    
    if (fromBit.nextSibling) {
        // Let's return the next child
        return fromBit.nextSibling
    }
    
    // Return the first child of the next parent
    return parent.nextSibling.firstChild
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
        sheetIdx * 1000 +
        rowIdx * 100 +
        barIdx * 10 +
        bitIdx
    )
    return bitNumber
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

        return bitANumber > bitBNumber
    })

    let hiddenBits = []

    selectedBits.forEach(bit => {
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
            selectNoteBtn(img)
            imgs = bit.querySelectorAll("img")
        }
    })
}

addEventListener("keypress", event => {
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
    }

    handler = keyHandler[event.key]
    if (handler) {
        handler()
    }
});