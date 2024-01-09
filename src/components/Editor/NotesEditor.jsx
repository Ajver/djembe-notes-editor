import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NoteSymbol } from "../../constants/NoteDef"
import { BeatType } from "../../constants/BeatDef"
import { deselectAll, extendSelectionLeft, extendSelectionRight, moveSelectionLeft, moveSelectionRight } from "../../Redux/editorSlice"
import { setBeatType, setNote } from "../../Redux/rhythmSlice"
import { playNote } from "../../helpers/playing/playing"

export default function NotesEditor() {
  const anyPopupOpened = useSelector(store => store.modals.anyPopupOpened)

  const beatsCount = useSelector(store => store.rhythm.beatsCount)
  const notesOrder = useSelector(store => store.layout.notesOrder)
  const selectionStartIdx = useSelector(store => store.editor.selectionStartIdx)
  const selectionEndIdx = useSelector(store => store.editor.selectionEndIdx)
  const dispatch = useDispatch()

  function changeNote(noteSymbol) {
    let anythingChanged = false

    for (let i = selectionStartIdx; i <= selectionEndIdx; i++) {
      const noteLocation = notesOrder[i]
      if (noteLocation) {
        dispatch(setNote({ noteLocation, noteSymbol }))
        anythingChanged = true
      }
    }

    if (anythingChanged) {
      playNote(noteSymbol)
    }
  }

  function changeBeatType(beatType) {
    for (let i = selectionStartIdx; i <= selectionEndIdx; i++) {
      const noteLocation = notesOrder[i]
      if (noteLocation) {
        const {
          instrumentIdx,
          beatIdx,
        } = noteLocation

        // TODO: Optimize by updating beat type only once!
        
        dispatch(setBeatType({
          instrumentIdx,
          beatIdx,
          newType: beatType,
        }))
      }
    }
  }

  function copyNotes() {
    // TODO
  }

  function cutNotes() {
    // TODO
  }

  function pasteNotes() {
    // TODO
  }

  function selectAllNotes() {

  }

  function deselectAllNotes() {
    dispatch(deselectAll())
  }

  function moveNotesSelectionLeft() {
    dispatch(moveSelectionLeft())
  }

  function moveNotesSelectionRight() {
    dispatch(moveSelectionRight(notesOrder.length))
  }

  function extendNotesSelectionLeft() {
    dispatch(extendSelectionLeft())
  }

  function extendNotesSelectionRight() {
    dispatch(extendSelectionRight(notesOrder.length))
  }

  function onKeyDown(event) {
    const keyHandler = {
      "`": () => changeNote(NoteSymbol.EMPTY),
      "1": () => changeNote(NoteSymbol.BASS),
      "2": () => changeNote(NoteSymbol.TONE),
      "3": () => changeNote(NoteSymbol.SLAP),
      "4": () => changeNote(NoteSymbol.GHOST),
      // Shift + 1
      "!": () => changeBeatType(BeatType.SINGLE),
      // Shift + 2
      "@": () => changeBeatType(BeatType.DOUBLE),
      // Shift + 3
      "#": () => changeBeatType(BeatType.TRIPLET),
      // Shift + 4
      "$": () => changeBeatType(BeatType.QUARTET),
      "c": () => {
          if (event.ctrlKey || event.metaKey) {
              copyNotes()
          }
      },
      "v": () => {
          if (event.ctrlKey || event.metaKey) {
              pasteNotes()
          }
      },
      "x": () => {
          if (event.ctrlKey || event.metaKey) {
              cutNotes()
          }
      },
      "a": () => {
          if (event.ctrlKey || event.metaKey) {
              selectAllNotes()
              event.preventDefault()
          }
      },
      "Escape": () => deselectAllNotes(),
      "ArrowLeft": () => {
        if (event.shiftKey) {
          extendNotesSelectionLeft()
        }else {
          moveNotesSelectionLeft()
        }
      },
      "ArrowRight": () => {
        if (event.shiftKey) {
          extendNotesSelectionRight()
        }else {
          moveNotesSelectionRight()
        }
      },
    }

    const handler = keyHandler[event.key]
    if (handler) {
        handler()
    }
  }
  
  useEffect(() => {
    if (anyPopupOpened) {
      // Do NOT allow notes edition when any popup is opened
      return
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [selectionStartIdx, selectionEndIdx, beatsCount, anyPopupOpened])

  return (null)
}
