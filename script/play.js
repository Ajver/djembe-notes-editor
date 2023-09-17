
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
    document.querySelector(".beat.playing").classList.remove("playing")
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
    const singleBeatPartDuration = (60_000.0 / rythmTempo) / partsInBeat

    const durationPerTypes = {
        "single": singleBeatPartDuration,
        "double": singleBeatPartDuration / 2,
        "triplet": singleBeatPartDuration / 3,
        "grace": singleBeatPartDuration / 4,
    }

    // Every note is a pointer to the sound and duration in millis of this note (delay before playing next note)
    let notesToPlay = []

    // From this note we'll start playing the rythm, if we find any selected note
    let firstSelectedNoteIdx = -1
    
    /**
     * How many notes we already prepared for playing
     */
    let currentNoteCounter = 0

    document.querySelectorAll(".beat-part").forEach((beatPartBtn) => {
        const beat = beatPartBtn.parentNode

        const beatPartType = beatPartBtn.getAttribute("beat-part-type")
        let duration = durationPerTypes[beatPartType]

        if (duration === undefined) {
            console.log("Unknown beatPartType: ", beatPartType)
            return
        }

        /**
         * Which note in a beatPart this is?
         */
        let nthNote = 0

        beatPartBtn.querySelectorAll(".note").forEach((noteBtn) => {
            const note = noteBtn.getAttribute("note")
            const sound = sounds[note]

            if (beatPartType === "grace") {
                /**
                 * Grace beatParts are tricky, becaues the first note is played before the beatPart,
                 * and the second note is actually ON beatPart
                 * also duration is not the same: between grace notes the delay is tiny, but between second
                 * note, and the following beatPart, the duration as for the single beatPart
                 * 
                 * To solve this, we need to shorten duration of the PREVIOUS note (before the grace),
                 * set the duration of the first grace note to 'grace-specific duration', 
                 * and then set the duration of the second note to 'single-specific duration'
                 */

                if (nthNote === 0) {
                    if (currentNoteCounter > 0) {
                        // There is "previous note" - let's shorten duration of the previous note
                        const previousNoteToPlay = notesToPlay[currentNoteCounter - 1]
                        previousNoteToPlay.duration -= duration  // Shortening by the duration of the grace note
                    }
                }else {
                    // It's second note in the grace beatPart - it should have a duration, as it was single note
                    duration = durationPerTypes["single"]
                }
            }

            notesToPlay.push({
                beat: beat,
                sound: sound,
                duration: duration,
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
    
    let lastPlayedBeat = null

    const playAndContinue = (playedNoteIdx) => {
        if (!isPlayingRythm) {
            return
        }

        const {beat, sound, duration} = notesToPlay[playedNoteIdx]
        
        if (lastPlayedBeat && lastPlayedBeat !== beat) {
            lastPlayedBeat.classList.remove("playing")
        }

        beat.classList.add("playing")
        lastPlayedBeat = beat
        
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
        }, duration)
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