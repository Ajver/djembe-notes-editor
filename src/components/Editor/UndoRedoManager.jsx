import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { overrideWholeRhythm } from "../../Redux/rhythmSlice"

export default function UndoRedoManager() {
  const anyPopupOpened = useSelector(store => store.modals.anyPopupOpened)
  
  const rhythm = useSelector(store => store.rhythm)
  const dispatch = useDispatch()

  const [isChangedFromHistory, setIsChangedFromHistory] = useState(false)
  const [past, setPast] = useState([])
  const [present, setPresent] = useState(rhythm)
  const [future, setFuture] = useState([])

  function overrideRhythmFromHistory(newRhythm) {
    setIsChangedFromHistory(true)
    dispatch(overrideWholeRhythm(newRhythm))
  }

  function undo() {
    if (past.length === 0) {
      // No past!
      return
    }

    const previousState = past[past.length - 1]
    const newPast = past.slice(0, past.length - 1)
    setPast(newPast)
    setPresent(previousState)
    setFuture([present, ...future])

    overrideRhythmFromHistory(previousState)
  }

  function redo() {
    if (future.length === 0) {
      // No future!
      return
    }

    const nextState = future[0]
    const newFuture = future.slice(1)
    setPast([...past, present])
    setPresent(nextState)
    setFuture(newFuture)

    overrideRhythmFromHistory(nextState)
  }

  function onRhythmChanged() {
    if (isChangedFromHistory) {
      // Don't change history this time, because history has just been changed by undo/redo
      // Reset one-time flag
      setIsChangedFromHistory(false)
      return
    }

    setPast([...past, present])
    setPresent(rhythm)
    setFuture([])
  }

  function onKeyDown(event) {
    if (event.ctrlKey || event.metaKey) {
        if (event.code === "KeyZ") {
          if (event.shiftKey) {
            // Ctrl + Shift + Z
            redo()
            event.preventDefault()
          }else {
            // Ctrl + Z
            undo()
            event.preventDefault()
          }
        }else if (event.code === "KeyY") {
          // Ctrl + Y
          redo()
          event.preventDefault()
        }
    }
  }

  useEffect(() => {
    onRhythmChanged()
  }, [rhythm])

  useEffect(() => {
    if (anyPopupOpened) {
      // Do NOT allow notes edition when any popup is opened
      return
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [past, future, present])

  return (null)
}
