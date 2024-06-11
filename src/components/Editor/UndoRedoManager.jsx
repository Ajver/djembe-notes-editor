import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resetHistory, setChangedFromHistory, setHistoryFuture, setHistoryPast, setHistoryPresent } from "../../Redux/editorSlice"
import { rhythmEditRedo, rhythmEditUndo } from "../../helpers/undoRedo"

export default function UndoRedoManager() {
  const anyPopupOpened = useSelector(store => store.modals.anyPopupOpened)
  
  const rhythm = useSelector(store => store.rhythm)
  const dispatch = useDispatch()

  const isChangedFromHistory = useSelector(store => store.editor.isChangedFromHistory)
  const past = useSelector(store => store.editor.past)
  const present = useSelector(store => store.editor.present)
  const future = useSelector(store => store.editor.future)

  function undo() {
    rhythmEditUndo(past, present, future, dispatch)
  }

  function redo() {
    rhythmEditRedo(past, present, future, dispatch)
  }

  function onRhythmChanged() {
    if (isChangedFromHistory) {
      // Don't change history this time, because history has just been changed by undo/redo
      // Reset one-time flag
      dispatch(setChangedFromHistory(false))
      return
    }

    dispatch(setHistoryPast([...past, present]))
    dispatch(setHistoryPresent(rhythm))
    dispatch(setHistoryFuture([]))
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
    // Initial reset
    dispatch(resetHistory(rhythm))
  }, [])

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
