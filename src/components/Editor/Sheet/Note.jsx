import React, { useRef, useState } from 'react'
import "./css/Note.css"
import { useDispatch, useSelector } from "react-redux"
import { singleSelect, deselectAll, addToSelection, rangeSelectMobile, mobileMultiselectEnd } from "../../../Redux/editorSlice"
import { setNote } from "../../../Redux/rhythmSlice"
import { NoteSymbol } from "../../../constants/NoteDef"
import { playNote } from "../../../helpers/playing/playing"
import { calculateNoteNumber } from "../../../helpers/noteNumber"
import { MOBILE_MAX_WIDTH } from "../../../constants/MobileUi"

export default function Note({noteLocation}) {
  const { instrumentIdx, beatIdx, noteIdx } = noteLocation

  const isDesktopVersion = window.innerWidth > MOBILE_MAX_WIDTH

  const selectionStartIdx  = useSelector(store => store.editor.selectionStartIdx)
  const selectionStartInstrument  = useSelector(store => store.editor.selectionStartInstrument)
  const selectionEndIdx  = useSelector(store => store.editor.selectionEndIdx)
  const selectionEndInstrument  = useSelector(store => store.editor.selectionEndInstrument)

  const beatDef = useSelector(store => store.rhythm.definition[instrumentIdx][beatIdx])
  const dispatch = useDispatch()

  const noteSymbol = beatDef.notes[noteIdx]

  const noteNumberInInstrument = calculateNoteNumber(beatIdx, noteIdx)

  function handleClick(event) {
    if (isDesktopVersion) {
      const symbols = Object.values(NoteSymbol)
      const currentIdx = symbols.findIndex(s => s == noteSymbol)
      const nextIdx = (currentIdx + 1) % symbols.length
      const nextSymbol = symbols[nextIdx]

      dispatch(setNote({
        noteLocation,
        noteSymbol: nextSymbol,
      }))

      playNote(nextSymbol)
    } else {
      // On mobile clicking simply selects the note
      // let's play the current note to give any feedback
      playNote(noteSymbol)
      
      // If anything was multi-selected before, let's remove the multi selection and start a normal selection
      dispatch(mobileMultiselectEnd())
    }
  }

  function handleRightClick(event) {
    event.preventDefault()

    if (isDesktopVersion) {
      dispatch(setNote({ noteLocation, noteSymbol: NoteSymbol.EMPTY }))
    } else {
      // On mobile right-clicking (or holding for longer) should NOT delete the note.
      // Instead - we start a mobile multi selection
      console.log("start multi select mob")
      const selectionData = {
        selectionStartIdx: noteNumberInInstrument, 
        selectionStartInstrument: instrumentIdx,
        selectionEndIdx: noteNumberInInstrument,
        selectionEndInstrument: instrumentIdx,
      }
      dispatch(rangeSelectMobile(selectionData))
    }
  }

  function handleMouseEnter(event) {
    const selectionData = {
      idx: noteNumberInInstrument,
      instrument: instrumentIdx,
    }

    if (event.shiftKey || event.buttons === 1) {
      dispatch(addToSelection(selectionData))
    }else {
      dispatch(singleSelect(selectionData))
    }
  }

  function handleMouseLeave(event) {
    const wasTouch = event.nativeEvent.sourceCapabilities.firesTouchEvents
    if (wasTouch) {
      // Do NOT deselect on touch devices
      return
    }

    if (!event.shiftKey && event.buttons !== 1) {
      dispatch(deselectAll())
    }
  }

  const isSelected = (
    noteNumberInInstrument >= selectionStartIdx 
    && noteNumberInInstrument <= selectionEndIdx
    && instrumentIdx >= selectionStartInstrument
    && instrumentIdx <= selectionEndInstrument
  )

  const isSelectionStart = noteNumberInInstrument === selectionStartIdx && instrumentIdx === selectionStartInstrument
  const isSelectionEnd = noteNumberInInstrument === selectionEndIdx && instrumentIdx === selectionEndInstrument

  const hoverClass = isSelected ? "selected" : ""
  const startClass = isSelectionStart ? "selection-start" : ""
  const endClass = isSelectionEnd ? "selection-end" : ""

  const imgSrc = {
    "-": "assets/svg/dash.svg",
    "B": "assets/svg/bass.svg",
    "T": "assets/svg/tone.svg",
    "S": "assets/svg/cross.svg",
    "G": "assets/svg/ghost.svg",
  }[noteSymbol]

  return (
    <div 
      className={["note", hoverClass, startClass, endClass].join(" ")} 
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => e.preventDefault()}
      data-instrument-idx={instrumentIdx}
      data-beat-idx={beatIdx}
      data-note-idx={noteIdx}
    >
      <img src={imgSrc} alt={noteSymbol} />
    </div>
  )
}
