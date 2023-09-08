
const IMG_URLS = {
    "empty": "svg/dash.svg",
    "bass": "svg/b-letter.svg",
    "tone": "svg/dot.svg",
    "slap": "svg/cross.svg",
}

let selectedBits = []

const deselectAllBits = () => {
    selectedBits.forEach(bitBtn => {
        bitBtn.classList.remove("selected")
    })

    selectedBits = []
}

const setNoteForBit = (bitBtn, note) => {
    bitBtn.setAttribute("note", note)
    const img = bitBtn.querySelector("img")
    img.src = IMG_URLS[note]
}

const setNoteForSelectedBits = note => {
    selectedBits.forEach(bitBtn => {
        setNoteForBit(bitBtn, note)
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
    setNoteForBit(bitBtn, note)
}

addEventListener("keypress", event => {
    const keyHandler = {
        "`": () => setNoteForSelectedBits("empty"),
        "1": () => setNoteForSelectedBits("bass"),
        "2": () => setNoteForSelectedBits("tone"),
        "3": () => setNoteForSelectedBits("slap"),
    }

    handler = keyHandler[event.key]
    if (handler) {
        handler()
    }
});