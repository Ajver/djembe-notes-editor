
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

const setNoteForBits = note => {
    selectedBits.forEach(bitBtn => {
        bitBtn.setAttribute("note", note)
        const img = bitBtn.querySelector("img")
        img.src = IMG_URLS[note]
    });

    console.log("Note set: ", note)
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

    bitBtn.setAttribute("note", note)
    const img = bitBtn.querySelector("img")
    img.src = IMG_URLS[note]

    console.log("Note set: ", note)
}

addEventListener("keypress", event => {
    const keyHandler = {
        "`": () => setNoteForBits("empty"),
        "1": () => setNoteForBits("bass"),
        "2": () => setNoteForBits("tone"),
        "3": () => setNoteForBits("slap"),
    }

    handler = keyHandler[event.key]
    if (handler) {
        handler()
    }else {
        console.log(event)
    }
});