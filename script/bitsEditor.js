
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

const changeBitsToSingle = () => {
    getSelectedBits().forEach(bit => {
        if (bit.getAttribute("bit-type") === "single") {
            // It's already single
            return
        }

        bit.setAttribute("bit-type", "single")

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
    })
}

const changeBitsToDouble = () => {
    getSelectedBits().forEach(bit => {
        if (bit.getAttribute("bit-type") === "double") {
            // It's already double
            return
        }
        
        bit.setAttribute("bit-type", "double")

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
    })
}

const changeBitsToTriplets = () => {
    console.log("Changing to triplets")
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