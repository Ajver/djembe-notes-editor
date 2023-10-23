import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NoteSymbol } from "../../constants/NoteDef"
import { BeatType } from "../../constants/BeatDef"
import { setBeatType, setNote } from "../../Redux/rhythmSlice"
import { getIdxsFromNoteNumber } from "../../helpers/RhythmElementNumber"

export default function NotesEditor() {
  const beatsCount = useSelector(store => store.rhythm.beatsCount)
  const selectedIds = useSelector(store => store.editor.selectedIds)
  const dispatch = useDispatch()

  function changeNote(noteSymbol) {
    selectedIds.forEach(noteNumber => {
      dispatch(setNote({ noteNumber, noteSymbol }))
    })
  }

  function changeBeatType(beatType) {
    selectedIds.forEach(noteNumber => {
      const {
        instrumentIdx,
        beatIdx,
      } = getIdxsFromNoteNumber(noteNumber, beatsCount)    

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

  }

  function deselectAllNotes() {

  }

  function moveSelectionLeft() {

  }

  function moveSelectionRight() {

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
      "ArrowLeft": () => moveSelectionLeft(),
      "ArrowRight": () => moveSelectionRight(),
    }

    const handler = keyHandler[event.key]
    if (handler) {
        handler()
    }
  }
  
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [selectedIds, beatsCount])

  return (null)
}
