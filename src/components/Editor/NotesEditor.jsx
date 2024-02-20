import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NoteSymbol } from "../../constants/NoteDef"
import { BeatType } from "../../constants/BeatDef"
import { selectAll, deselectAll, extendSelectionLeft, extendSelectionRight, extendSelectionUp, extendSelectionDown, moveSelectionLeft, moveSelectionRight, moveSelectionUp, moveSelectionDown } from "../../Redux/editorSlice"
import { setBeatType, setNote } from "../../Redux/rhythmSlice"
import { playNote } from "../../helpers/playing/playing"
import { calculateNoteNumber, getLocationFromNoteNumber } from "../../helpers/noteNumber"

export default function NotesEditor() {
  const anyPopupOpened = useSelector(store => store.modals.anyPopupOpened)

  const beatsCount = useSelector(store => store.rhythm.beatsCount)
  const definition = useSelector(store => store.rhythm.definition)
  // const notesOrder = useSelector(store => store.layout.notesOrder)
  const selectionStartIdx = useSelector(store => store.editor.selectionStartIdx)
  const selectionStartInstrument = useSelector(store => store.editor.selectionStartInstrument)
  const selectionEndIdx = useSelector(store => store.editor.selectionEndIdx)
  const selectionEndInstrument = useSelector(store => store.editor.selectionEndInstrument)
  const dispatch = useDispatch()

  function forEachSelectedNote(callback) {
    for (let instrumentIdx = selectionStartInstrument; instrumentIdx <= selectionEndInstrument; instrumentIdx++) {
      for (let noteNumber = selectionStartIdx; noteNumber <= selectionEndIdx; noteNumber++) {
        const noteLocation = getLocationFromNoteNumber(noteNumber, instrumentIdx)
        const noteExists = (
          noteLocation.noteIdx < definition[instrumentIdx][noteLocation.beatIdx].notes.length
        )
        if (noteExists) {
          callback(noteLocation)
        }
      }
    }
  }

  function changeNote(noteSymbol) {
    let anythingChanged = false

    forEachSelectedNote(noteLocation => {
      dispatch(setNote({ noteLocation, noteSymbol }))
      anythingChanged = true
    })

    if (anythingChanged) {
      playNote(noteSymbol)
    }
  }

  function changeBeatType(beatType) {
    forEachSelectedNote(noteLocation => {
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
    })
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
    const selectionData = {
      totalNotesCount: calculateNoteNumber(beatsCount, 0),
      totalInstrumentsCount: definition.length,
    }
    dispatch(selectAll(selectionData))
  }

  function deselectAllNotes() {
    dispatch(deselectAll())
  }

  function moveNotesSelectionLeft() {
    dispatch(moveSelectionLeft())
  }

  function moveNotesSelectionRight() {
    dispatch(moveSelectionRight(calculateNoteNumber(beatsCount, 0)))
  }

  function moveNotesSelectionUp() {
    dispatch(moveSelectionUp())
  }

  function moveNotesSelectionDown() {
    dispatch(moveSelectionDown(definition.length))
  }

  function extendNotesSelectionLeft() {
    dispatch(extendSelectionLeft())
  }

  function extendNotesSelectionRight() {
    dispatch(extendSelectionRight(calculateNoteNumber(beatsCount, 0)))
  }

  function extendNotesSelectionUp() {
    dispatch(extendSelectionUp())
  }

  function extendNotesSelectionDown() {
    dispatch(extendSelectionDown(definition.length))
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
      "ArrowUp": () => {
        if (event.shiftKey) {
          extendNotesSelectionUp()
        }else {
          moveNotesSelectionUp()
        }
        event.preventDefault()
      },
      "ArrowDown": () => {
        if (event.shiftKey) {
          extendNotesSelectionDown()
        }else {
          moveNotesSelectionDown()
        }
        event.preventDefault()
      }
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
  }, [
    selectionStartIdx, 
    selectionStartInstrument, 
    selectionEndIdx, 
    selectionEndInstrument, 
    beatsCount, 
    anyPopupOpened, 
    definition
  ])

  return (null)
}
