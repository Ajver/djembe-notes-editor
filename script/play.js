
let isPlayingRythm = false
let nextTimeoutIds = []

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
    document.querySelectorAll(".beat.playing").forEach(beat => beat.classList.remove("playing"))
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

    nextTimeoutIds.forEach(nextTimeoutId => {
        window.clearTimeout(nextTimeoutId)
    })

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

    // From this note we'll start playing the rythm, if we find any selected note
    let nextNoteToPlay = null

    sortSelectedNotes()

    if (selectedNotes[0]) {
        firstSelectedNote = selectedNotes[0]
    }else {
        nextNoteToPlay = getFirstNoteBtn()
    }

    const firstFullScore = nextNoteToPlay.parentNode.parentNode.parentNode.parentNode

    /**
     * Plays notes in the bar delayed,
     * when finishes playing this bar, triggers playing according bar in the next full-score
     * @param {*} bar 
     * @param {*} nthBar
     * @param {*} delay 
     */
    const playBarDelayed = (bar, nthBar, barPlayDelay) => {
        if (!isPlayingRythm) {
            return
        }

        const allNotes = bar.querySelectorAll(".note")

        let lastPlayedBeat = null

        const playNoteDelayedAndContinue = (noteIdx, delay) => {
            if (!isPlayingRythm) {
                return
            }

            const noteBtn = allNotes[noteIdx]
            const beatPart = noteBtn.parentNode
            const beatPartType = beatPart.getAttribute("beat-part-type")
            /**
             * How long this note will be played
             */
            let duration = durationPerTypes[beatPartType]

            if (beatPartType === "grace") {
                const allNotesInPart = beatPart.querySelectorAll(".note")
                const nthNote = Array.prototype.indexOf.call(allNotesInPart, noteBtn)

                if (nthNote === 0) {
                    // It's the first note of grace beat part. Let's play a bit earlier
                    delay -= durationPerTypes["grace"]
                } else {
                    // It's second note in the grace beatPart - it should have a duration, as it was single note
                    duration = durationPerTypes["single"]
                }
            }

            const highlightCurrentlyPlayedBeat = () => {
                const beat = beatPart.parentNode

                if (lastPlayedBeat && lastPlayedBeat !== beat) {
                    lastPlayedBeat.classList.remove("playing")
                }
        
                beat.classList.add("playing")
                lastPlayedBeat = beat
            }

            const timeoutId = setTimeout(() => {
                if (!isPlayingRythm) {
                    return
                }
                
                playNoteBtn(noteBtn)
                
                highlightCurrentlyPlayedBeat()

                if (noteIdx + 1 < allNotes.length) {
                    // Queue playing the next note, delayed by the duration of currently played one
                    playNoteDelayedAndContinue(noteIdx + 1, duration)
                }else {
                    lastPlayedBeat.classList.remove("playing")

                    // End of the notes in bar. Let's play next bar instead, delayed by the duration of currently played note
                    const nextBar = bar.parentNode.nextSibling.querySelectorAll(".bar")[nthBar]
                    if (nextBar) {
                        // There is nextBar - let's play it!
                        playBarDelayed(nextBar, nthBar, duration)
                    }else {
                        // End of the rythm
                        stopPlayingRythm()
                    }
                }
            }, delay)

            nextTimeoutIds[nthBar] = timeoutId
        }

        playNoteDelayedAndContinue(0, barPlayDelay)
    }

    const playFullScore = (fullScore) => {
        // HACK: Delay playing all bards by the duration of grace note, 
        // in case there are any grace notes at the beggining (then the bar will be played a bit quicker)
        const standardDelay = durationPerTypes["grace"]
        const allBars = fullScore.querySelectorAll(".bar")

        nextTimeoutIds = Array(allBars.length)
        console.log(nextTimeoutIds)

        allBars.forEach((bar, nthBar) => {
            playBarDelayed(bar, nthBar, standardDelay)
        })
    }

    document.querySelector("body").classList.add("playing")
    isPlayingRythm = true
    playFullScore(firstFullScore)
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