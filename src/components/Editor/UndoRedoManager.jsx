import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resetHistory, setChangedFromHistory, setHistoryFuture, setHistoryPast, setHistoryPresent } from "../../Redux/editorSlice"

export default function UndoRedoManager() {
  
  const rhythm = useSelector(store => store.rhythm)
  const dispatch = useDispatch()

  const isChangedFromHistory = useSelector(store => store.editor.isChangedFromHistory)
  const past = useSelector(store => store.editor.past)
  const present = useSelector(store => store.editor.present)

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

  useEffect(() => {
    // Initial reset
    dispatch(resetHistory(rhythm))
  }, [])

  useEffect(() => {
    onRhythmChanged()
  }, [rhythm])

  return (null)
}
