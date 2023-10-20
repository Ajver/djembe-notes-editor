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

  const noteSymbol = beatDef.notes[noteIdx]

  const beatNumber = beatIdx * 10
  const instrumentNumber = instrumentIdx * beatsCount * 10
  const noteNumber = instrumentNumber + beatNumber + noteIdx
  
  function handleClick(event) {
    const symbols = Object.values(NoteSymbol)
    const currentIdx = symbols.findIndex(s => s == noteSymbol)
    const nextIdx = (currentIdx + 1) % symbols.length
    const nextSymbol = symbols[nextIdx]
    dispatch(setNote({
      noteNumber,
      noteSymbol: nextSymbol,
    }))
  }

  function handleRightClick(event) {
    event.preventDefault()
    dispatch(setNote({ noteNumber, noteSymbol: NoteSymbol.EMPTY }))
  }

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

  const noteClass = {
    "-": "empty",
    "B": "bass",
    "T": "tone",
    "S": "slap",
    "G": "ghost",
  }[noteSymbol]

  const hoverClass = (
    (selection.selectedIds.includes(noteNumber)) 
    ? "selected"
    : ""
  ) 

  return (
    <div 
      className={["note ", noteClass, hoverClass].join(" ")} 
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => e.preventDefault()}
    >
    </div>
  )
}
