import { setChangedFromHistory, setHistoryFuture, setHistoryPast, setHistoryPresent } from "../Redux/editorSlice"
import { overrideWholeRhythm } from "../Redux/rhythmSlice"


function overrideRhythmFromHistory(newRhythm, dispatch) {
  dispatch(setChangedFromHistory(true))
  dispatch(overrideWholeRhythm(newRhythm))
}

export function rhythmEditUndo(past, present, future, dispatch) {
  if (past.length === 0) {
    // No past!
    return
  }

  const previousState = past[past.length - 1]
  const newPast = past.slice(0, past.length - 1)

  dispatch(setHistoryPast(newPast))
  dispatch(setHistoryPresent(previousState))
  dispatch(setHistoryFuture([present, ...future]))

  overrideRhythmFromHistory(previousState, dispatch)
}

export function rhythmEditRedo(past, present, future, dispatch) {
  if (future.length === 0) {
    // No future!
    return
  }

  const nextState = future[0]
  const newFuture = future.slice(1)
  dispatch(setHistoryPast([...past, present]))
  dispatch(setHistoryPresent(nextState))
  dispatch(setHistoryFuture(newFuture))

  overrideRhythmFromHistory(nextState, dispatch)
}
