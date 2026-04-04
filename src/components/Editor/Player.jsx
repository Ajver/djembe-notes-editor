import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentBarIdx, stop } from "../../Redux/playerSlice"
import { playNote } from "../../helpers/playing/playing"

export default function Player() {
  const rhythmData = useSelector(store => store.rhythm)
  const isPlaying = useSelector(store => store.player.isPlaying)
  const repeat = useSelector(store => store.player.repeat)
  const dispatch = useDispatch()

  const stateRef = useRef({
    isPlaying: false,
    timeoutIds: [],
    rhythm: null,
    repeat: false
  })

  // Update refs when redux state changes
  useEffect(() => { stateRef.current.rhythm = rhythmData }, [rhythmData])
  useEffect(() => { stateRef.current.repeat = repeat }, [repeat])

  const clearAllTimers = () => {
    stateRef.current.timeoutIds.forEach(id => clearTimeout(id))
    stateRef.current.timeoutIds = []
  }

  const playRhythm = (dispatch) => {
    const { rhythm, repeat } = stateRef.current
    if (!rhythm) return

    const singleBeatPartDuration = 60_000.0 / rhythm.tempo
    const durationPerTypes = {
      "single": singleBeatPartDuration,
      "double": singleBeatPartDuration / 2,
      "triplet": singleBeatPartDuration / 3,
      "quartet": singleBeatPartDuration / 4,
      "grace": singleBeatPartDuration / 4,
    }

    let instrumentsStillPlaying = rhythm.definition.length
    const standardDelay = durationPerTypes["grace"]

    function onInstrumentFinished(shouldReplay, replayDelay) {
      instrumentsStillPlaying--
      
      if (instrumentsStillPlaying <= 0) {
        if (shouldReplay && stateRef.current.isPlaying) {
          const tid = setTimeout(() => playRhythm(dispatch), replayDelay)
          stateRef.current.timeoutIds.push(tid)
        } else {
          dispatch(stop())
        }
      }
    }

    function playNoteDelayedAndContinue(nthInstrument, beatIdx, noteIdx, delay) {
      if (!stateRef.current.isPlaying) return

      const instrumentDefinition = rhythm.definition[nthInstrument]
      const beatDef = instrumentDefinition[beatIdx]

      if (!beatDef) {
        onInstrumentFinished(false, 0)
        return
      }

      const tid = setTimeout(() => {
        if (!stateRef.current.isPlaying) return

        playNote(beatDef.notes[noteIdx])

        // Highlight logic
        const barIdx = Math.floor(beatIdx / rhythm.beatsInBar)
        dispatch(setCurrentBarIdx(barIdx))

        const nextNoteIdx = noteIdx + 1
        let duration = durationPerTypes[beatDef.type]

        if (nextNoteIdx < beatDef.notes.length) {
          playNoteDelayedAndContinue(nthInstrument, beatIdx, nextNoteIdx, duration)
        } else {
          const nextBeatIdx = beatIdx + 1
          if (nextBeatIdx < rhythm.beatsCount) {
            playNoteDelayedAndContinue(nthInstrument, nextBeatIdx, 0, duration)
          } else {
            const replayDelay = Math.max(duration - standardDelay, 0)
            onInstrumentFinished(stateRef.current.repeat, replayDelay)
          }
        }
      }, delay)

      stateRef.current.timeoutIds.push(tid)
    }

    rhythm.definition.forEach((_, nthInstrument) => {
      playNoteDelayedAndContinue(nthInstrument, 0, 0, standardDelay)
    })
  }

  useEffect(() => {
    if (isPlaying) {
      stateRef.current.isPlaying = true
      playRhythm(dispatch)
    } else {
      stateRef.current.isPlaying = false
      clearAllTimers()
    }

    // Cleanup function: stops everything if component unmounts
    return () => {
      stateRef.current.isPlaying = false
      clearAllTimers()
    }
  }, [isPlaying])

  return null
}