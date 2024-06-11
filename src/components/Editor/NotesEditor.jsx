import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { deselectAll, extendSelectionDown, extendSelectionLeft, extendSelectionRight, extendSelectionUp, moveSelectionDown, moveSelectionLeft, moveSelectionRight, moveSelectionUp, selectAll } from "../../Redux/editorSlice"
import { setBeatType, setNote } from "../../Redux/rhythmSlice"
import { BeatType } from "../../constants/BeatDef"
import { NoteSymbol } from "../../constants/NoteDef"
import { copySelectedBeats, pasteBeatsFromClipboard } from "../../helpers/copyPasteRhythm"
import { calculateNoteNumber, getLocationFromNoteNumber } from "../../helpers/noteNumber"
import { playNote } from "../../helpers/playing/playing"
import { rhythmEditRedo, rhythmEditUndo } from "../../helpers/undoRedo"

export default function NotesEditor() {
  const anyPopupOpened = useSelector(store => store.modals.anyPopupOpened)

  const beatsCount = useSelector(store => store.rhythm.beatsCount)
  const definition = useSelector(store => store.rhythm.definition)
  const selectionStartIdx = useSelector(store => store.editor.selectionStartIdx)
  const selectionStartInstrument = useSelector(store => store.editor.selectionStartInstrument)
  const selectionEndIdx = useSelector(store => store.editor.selectionEndIdx)
  const selectionEndInstrument = useSelector(store => store.editor.selectionEndInstrument)
  const clipboardContent = useSelector(store => store.editor.copyClipboard)
  const past = useSelector(store => store.editor.past)
  const present = useSelector(store => store.editor.present)
  const future = useSelector(store => store.editor.future)

  const dispatch = useDispatch()

  function forEachSelectedNote(callback) {
    if (selectionStartInstrument < 0) {
      // Nothing selected
      return
    }
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

  function copyBeats() {
    copySelectedBeats(definition, selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, dispatch)
  }

  function cutBeats() {
    copyBeats()
    
    // Clear notes
    const copyStartBeatIdx = Math.floor(selectionStartIdx / 4)
    const copyEndBeatIdx = Math.floor(selectionEndIdx / 4)
    for (let instrumentIdx = selectionStartInstrument; instrumentIdx <= selectionEndInstrument; instrumentIdx++) {
      for (let beatIdx = copyStartBeatIdx; beatIdx <= copyEndBeatIdx; beatIdx++) {
        definition[instrumentIdx][beatIdx].notes.forEach((_, noteIdx) => {
          const noteLocation = {
            instrumentIdx,
            beatIdx,
            noteIdx,
          }
          const noteSymbol = NoteSymbol.EMPTY
          dispatch(setNote({noteLocation, noteSymbol}))
        })
      }
    }
  }

  function pasteBeats() {
    pasteBeatsFromClipboard(clipboardContent, selectionStartIdx, selectionStartInstrument, dispatch)
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

  function handleUndo() {
    rhythmEditUndo(past, present, future, dispatch)
  }

  function handleRedo() {
    rhythmEditRedo(past, present, future, dispatch)
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
      "§": () => changeNote(NoteSymbol.EMPTY),  // For mac keyboards
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
              copyBeats()
          }
      },
      "v": () => {
          if (event.ctrlKey || event.metaKey) {
              pasteBeats()
          }
      },
      "x": () => {
          if (event.ctrlKey || event.metaKey) {
              cutBeats()
          }
      },
      "a": () => {
          if (event.ctrlKey || event.metaKey) {
              selectAllNotes()
              event.preventDefault()
          }
      },
      "z": () => {
        if (event.ctrlKey || event.metaKey) {
          handleUndo()
          event.preventDefault()
        }
      },
      "Z": () => {
        // Ctrl + Shift + Z
        handleRedo()
        event.preventDefault()
      },
      "y": () => {
        if (event.ctrlKey || event.metaKey) {
          // Ctrl + Y
          handleRedo()
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
    definition,
    past,
    present,
    future,
  ])

  return (null)
}
