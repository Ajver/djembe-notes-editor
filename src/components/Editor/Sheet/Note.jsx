import React from 'react'
import "./css/Note.css"
import { useDispatch, useSelector } from "react-redux"
import { select, singleSelect, deselectAll } from "../../../Redux/selectionSlice"
import { setNote } from "../../../Redux/rhythmSlice"
import { NoteSymbol } from "../../../constants/NoteDef"

export default function Note({instrumentIdx, beatIdx, noteIdx}) {
  const selection  = useSelector(store => store.selection)
  const beatsCount = useSelector(store => store.rhythm.beatsCount)
  const beatDef = useSelector(store => store.rhythm.definition[instrumentIdx][beatIdx])
  
  const dispatch = useDispatch()

  const beatNumber = beatIdx * 10
  const instrumentNumber = instrumentIdx * beatsCount * 10
  const noteNumber = instrumentNumber + beatNumber + noteIdx

  const noteSymbol = beatDef.notes[noteIdx]
  const noteClass = {
    "-": "empty",
    "B": "bass",
    "T": "tone",
    "S": "slap",
    "G": "ghost",
  }[noteSymbol]
  
  function handleMouseEnter(event) {
    if (event.shiftKey || event.buttons == 1) {
      dispatch(select(noteNumber))
    }else {
      dispatch(singleSelect(noteNumber))
    }
  }

  function handleMouseLeave(event) {
    if (!event.shiftKey || event.buttons == 1) {
      dispatch(deselectAll(noteNumber))
    }
  }

  function handleRightClick(event) {
    event.preventDefault()
    dispatch(setNote({ noteNumber, noteSymbol: NoteSymbol.EMPTY }))
  }

  const hoverClass = (
    (selection.selectedIds.includes(noteNumber)) 
    ? "selected"
    : ""
  ) 

  return (
    <div 
      className={["note ", noteClass, hoverClass].join(" ")} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => e.preventDefault()}
      onContextMenu={handleRightClick}
    >
    </div>
  )
}
