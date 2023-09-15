
let isPlayingRythm = false
let nextTimeoutId = 0

const sounds = {
    "bass": new Sound("sound/Djembe_bass.wav"),
    "tone": new Sound("sound/Djembe_tone.wav"),
    "slap": new Sound("sound/Djembe_slap.wav"),
    "ghost": new Sound("sound/Djembe_ghost.wav"),
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

    const delayPerTypes = {
        "single": singleBitDelay,
        "double": singleBitDelay / 2,
        "triplet": (singleBitDelay * 2) / 3,
        "grace": singleBitDelay / 4,
    }

    // Every note is a pointer to the sound and delay in millis to the next one
    let notesToPlay = []

    // From this note we'll start playing the rythm, if we find any selected note
    let firstSelectedNoteIdx = -1
    
    /**
     * How many notes we already prepared for playing
     */
    let currentNoteCounter = 0

    document.querySelectorAll(".bit").forEach((bitBtn) => {
        if (bitBtn.classList.contains("hidden")) {
            // Skip hidden bits
            return
        }

        const bar = bitBtn.parentNode

        const bitType = bitBtn.getAttribute("bit-type")
        let delay = delayPerTypes[bitType]

        if (delay === undefined) {
            console.log("Unknown bitType: ", bitType)
            return
        }

        /**
         * Which note in a bit this is?
         */
        let nthNote = 0

        bitBtn.querySelectorAll("img").forEach((noteBtn) => {
            const note = noteBtn.getAttribute("note")
            const sound = sounds[note]

            if (bitType === "grace") {
                /**
                 * Grace bits are tricky, becaues the first note is played before the bit,
                 * and the second note is actually ON bit
                 * also delay is not the same: between grace notes the delay is tiny, but between second
                 * note, and the following bit, the delay is normal (as for the single bit)
                 * 
                 * To solve this, we need to shorten delay from the PREVIOUS note (before the grace),
                 * set the delay after first note to 'grace', and then set the delay of the second note
                 * to 'single'
                 */

                if (nthNote === 0) {
                    if (currentNoteCounter > 0) {
                        // There is "previous note" - let's shorten delay between previous and this one
                        const previousNoteToPlay = notesToPlay[currentNoteCounter - 1]
                        previousNoteToPlay.delay -= delay  // Shortening by the delay of the grace note
                    }
                }else {
                    // It's second note in the grace bit - it should have a delay to the next one, as it was single note
                    delay = delayPerTypes["single"]
                }
            }

            notesToPlay.push({
                bar: bar,
                sound: sound,
                delay: delay,
            })

            if (firstSelectedNoteIdx === -1 && noteBtn.classList.contains("selected") ) {
                firstSelectedNoteIdx = currentNoteCounter
            }

            nthNote++
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
    const body = document.querySelector("body")
    if (document.activeElement !== body) {
        // We should ONLY play, when we're focused on body (not any button, text input, etc)
        return
    }

    if (event.code === "Space") {
        if (isPlayingRythm) {
            stopPlayingRythm()
        }else {
            playRythm()
        }

        event.preventDefault()
    }
})