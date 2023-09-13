
let isPlayingRythm = false
let nextTimeoutId = 0

const sounds = {
    "bass": new Sound("sound/Djembe_bass.wav"),
    "tone": new Sound("sound/Djembe_tone.wav"),
    "slap": new Sound("sound/Djembe_slap.wav"),
}

Object.values(sounds).forEach(sound => {
    sound.load()
})


const onRythmPlayEnd = () => {
    document.querySelector("#play-btn").innerHTML = "PLAY"
}

document.querySelector("#play-btn").addEventListener("click", () => {
    if (isPlayingRythm) {
        isPlayingRythm = false

        window.clearTimeout(nextTimeoutId)

        onRythmPlayEnd()
        return
    }

    document.querySelector("#play-btn").innerHTML = "PAUSE"

    // Delays are in millis
    const singleBitDelay = (60_000.0 / rythmTempo) / notesInBar
    const doubleBitNoteDelay = singleBitDelay / 2
    const tripletBitNoteDelay = (singleBitDelay * 2) / 3

    console.log(singleBitDelay, doubleBitNoteDelay, tripletBitNoteDelay)

    // Every note is a pointer to the sound and delay in millis to the next one
    let notesToPlay = []

    document.querySelectorAll(".bit").forEach((bitBtn) => {
        if (bitBtn.classList.contains("hidden")) {
            // Skip hidden bits
            return
        }

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

            console.log(note, sound, delay)

            notesToPlay.push({
                sound: sound,
                delay: delay,
            })
        })
    })

    console.log(notesToPlay)

    if (notesToPlay.length == 0) {
        console.log("No notes to play")
        onRythmPlayEnd
        return
    }
    
    const playAndContinue = (playedNoteIdx) => {
        if (!isPlayingRythm) {
            return
        }

        const {sound, delay} = notesToPlay[playedNoteIdx]
        
        if (sound) {
            sound.play()
        }

        if (playedNoteIdx + 1 >= notesToPlay.length) {
            // The rythm has ended
            isPlayingRythm = false
            onRythmPlayEnd()
            return
        }

        nextTimeoutId = window.setTimeout(() => {
            playAndContinue(playedNoteIdx + 1)
        }, delay)
    }

    isPlayingRythm = true
    playAndContinue(0)
})