import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentBarIdx, stop } from "../../Redux/playerSlice"
import { playNote } from "../../helpers/playing/playing"

let localRhythmCopy = null
let isPlayingRhythm = false
let localRepeat = false


function playRhythm(dispatch) {
  isPlayingRhythm = true

  // Delays are in millis
  const singleBeatPartDuration = 60_000.0 / localRhythmCopy.tempo
  const durationPerTypes = {
    "single": singleBeatPartDuration,
    "double": singleBeatPartDuration / 2,
    "triplet": singleBeatPartDuration / 3,
    "quartet": singleBeatPartDuration / 4,
    "grace": singleBeatPartDuration / 4,
  }

  let instrumentsStillPlaying = localRhythmCopy.definition.length
  
  function onInstrumentFinished(replay, replayDelay) {
    instrumentsStillPlaying--

    if (instrumentsStillPlaying <= 0) {
      if (replay) {
        // Play again after delay, so that the previous rhythm fully finishes
        setTimeout(() => playRhythm(dispatch), replayDelay)
      } else {
        // We don't repeat OR this is force stop (i.e. due to no notes found)
        dispatch(stop())
      }
    }
  }


  // HACK: Delay playing all instruments by the duration of grace note, 
  // in case there are any grace notes at the beggining (then the rhythms will be played a bit quicker)
  const standardDelay = durationPerTypes["grace"]

  function playInstrumentDelayed(nthInstrument, delay) {
    playNoteDelayedAndContinue(nthInstrument, 0, 0, delay)
  }

  function playNoteDelayedAndContinue(nthInstrument, beatIdx, noteIdx, delay) {
    if (!isPlayingRhythm) {
        return
    }
  
    const instrumentDefinition = localRhythmCopy.definition[nthInstrument]
    const beatDef = instrumentDefinition[beatIdx]

    if (beatDef === undefined) {
      // No beats found - stopping without replay!
      onInstrumentFinished(false)
      return
    }

    const noteSymbol = beatDef.notes[noteIdx]

    /**
     * How long this note will be played
     */
    let duration = durationPerTypes[beatDef.type]
  
    // TODO
    // if (beatPartType === "grace") {
    //     const allNotesInPart = beatPart.querySelectorAll(".note")
    //     const nthNote = Array.prototype.indexOf.call(allNotesInPart, noteBtn)
  
    //     if (nthNote === 0) {
    //         // It's the first note of grace beat part. Let's play a bit earlier
    //         delay -= durationPerTypes["grace"]
    //     } else {
    //         // It's second note in the grace beatPart - it should have a duration, as it was single note
    //         duration = durationPerTypes["single"]
    //     }
    // }
  
    const highlightCurrentlyPlayedBeat = () => {
      if (isPlayingRhythm) {
        const barIdx = Math.floor(beatIdx / localRhythmCopy.beatsInBar)
        dispatch(setCurrentBarIdx(barIdx))
      }
    }
  
    setTimeout(() => {
      playNote(noteSymbol)
      
      highlightCurrentlyPlayedBeat()

      const nextNoteIdx = noteIdx + 1

      if (nextNoteIdx < beatDef.notes.length) {
          // Queue playing the next note, delayed by the duration of currently played one
          playNoteDelayedAndContinue(nthInstrument, beatIdx, nextNoteIdx, duration)
      }else {
          // End of the notes in beat. Let's play next beat instead, delayed by the duration of currently played note
          const nextBeatIdx = beatIdx + 1
          if (nextBeatIdx < localRhythmCopy.beatsCount) {
              // There is next beat - let's play it!
              playNoteDelayedAndContinue(nthInstrument, nextBeatIdx, 0, duration)
          }else {
              // End of the rhythm
              const replayDelay = Math.max(duration - standardDelay, 0)
              onInstrumentFinished(localRepeat, replayDelay)
          }
      }
    }, delay)
  }

  localRhythmCopy.definition.forEach((_, nthInstrument) => {
      playInstrumentDelayed(nthInstrument, standardDelay)
  })
}


function onRhythmPlayingStopped(dispatch) {
  isPlayingRhythm = false
}


export default function Player() {
  const rhythmData = useSelector(store => store.rhythm)
  const isPlaying = useSelector(store => store.player.isPlaying)
  const repeat = useSelector(store => store.player.repeat)
  const dispatch = useDispatch()

  useEffect(() => {
    localRhythmCopy = rhythmData
  }, [rhythmData])

  useEffect(() => {
    localRepeat = repeat
  }, [repeat])

  useEffect(() => {
    if (isPlaying) {
      playRhythm(dispatch)
    }else {
      onRhythmPlayingStopped(dispatch)
    }
  }, [isPlaying])

  return (null)
}
