
let isPlayingRythm = false
let nextTimeoutId = 0

const sounds = {
    // "bass": new Sound("sound/Djembe_bass.wav"),
    // "tone": new Sound("sound/Djembe_tone.wav"),
    // "slap": new Sound("sound/Djembe_slap.wav"),
    // "ghost": new Sound("sound/Djembe_ghost.wav"),

    "bass": new Sound("sound/fart-human-06.mp3"),
    "tone": new Sound("sound/burp-05.mp3"),
    "slap": new Sound("sound/burp-04.mp3"),
    "ghost": new Sound("sound/burp-07.mp3"),
}

Object.values(sounds).forEach(sound => {
    sound.load()
})


const onRythmPlayEnd = () => {
    document.querySelector("#play-btn").innerHTML = "PLAY"
    document.querySelector(".bar.playing").classList.remove("playing")
    document.querySelector("body").classList.remove("playing")
}

const playNoteBtn = (noteBtn) => {
    const note = noteBtn.getAttribute("note")
    const sound = sounds[note]
    if (sound) {
        sound.play()
    }
}

const stopPlayingRythm = () => {
    isPlayingRythm = false

    window.clearTimeout(nextTimeoutId)

    onRythmPlayEnd()
}

const playRythm = () => {
    if (isPlayingRythm) {
        stopPlayingRythm()
        return
    }

    document.querySelector("#play-btn").innerHTML = "PAUSE"

    // Delays are in millis
    const singleBitDelay = (60_000.0 / rythmTempo) / notesInBar
    const doubleBitNoteDelay = singleBitDelay / 2
    const tripletBitNoteDelay = (singleBitDelay * 2) / 3

    // Every note is a pointer to the sound and delay in millis to the next one
    let notesToPlay = []

    // From this note we'll start playing the rythm, if we find any selected note
    let firstSelectedNoteIdx = -1
    let currentNoteCounter = 0

    document.querySelectorAll(".bit").forEach((bitBtn) => {
        if (bitBtn.classList.contains("hidden")) {
            // Skip hidden bits
            return
        }

        const bar = bitBtn.parentNode 

        const bitType = bitBtn.getAttribute("bit-type")

        bitBtn.querySelectorAll("img").forEach((noteBtn) => {
            const note = noteBtn.getAttribute("note")
            const sound = sounds[note]

            let delay = singleBitDelay

            if (bitType === "double") {
                delay = doubleBitNoteDelay
            }else if (bitType === "triplet") {
                delay = tripletBitNoteDelay
            }

            notesToPlay.push({
                bar: bar,
                sound: sound,
                delay: delay,
            })

            if (firstSelectedNoteIdx === -1 && noteBtn.classList.contains("selected") ) {
                firstSelectedNoteIdx = currentNoteCounter
            }

            currentNoteCounter++
        })
    })

    if (notesToPlay.length == 0) {
        console.log("No notes to play")
        onRythmPlayEnd
        return
    }
    
    let lastPlayedBar = null

    const playAndContinue = (playedNoteIdx) => {
        if (!isPlayingRythm) {
            return
        }

        const {bar, sound, delay} = notesToPlay[playedNoteIdx]
        
        if (lastPlayedBar && lastPlayedBar !== bar) {
            lastPlayedBar.classList.remove("playing")
        }

        bar.classList.add("playing")
        lastPlayedBar = bar
        
        if (sound) {
            sound.play()
        }

        if (playedNoteIdx + 1 >= notesToPlay.length) {
            // The rythm has ended
            stopPlayingRythm()
            return
        }

        nextTimeoutId = window.setTimeout(() => {
            playAndContinue(playedNoteIdx + 1)
        }, delay)
    }

    let noteToStartPlay = 0

    if (firstSelectedNoteIdx > -1) {
        noteToStartPlay = firstSelectedNoteIdx
    }

    document.querySelector("body").classList.add("playing")
    isPlayingRythm = true
    playAndContinue(noteToStartPlay)
}

document.querySelector("#play-btn").addEventListener("click", () => {
    playRythm()
})

addEventListener("keydown", event => {
    if (event.code === "Space") {
        if (isPlayingRythm) {
            stopPlayingRythm()
        }else {
            playRythm()
        }

        event.preventDefault()
    }
})