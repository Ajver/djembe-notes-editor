import React from 'react'
import "./css/Note.css"
import { useDispatch, useSelector } from "react-redux"
import { addToSelection, singleSelect, deselectAll } from "../../../Redux/selectionSlice"

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
    console.log("Mouse Enter", event);

    if (event.shiftKey || event.buttons == 1) {
      dispatch(addToSelection(noteNumber))
    }else {
      dispatch(singleSelect(noteNumber))
    }
  }

  function handleMouseLeave(event) {
    console.log("Mouse Leave", event);

    if (!event.shiftKey || event.buttons == 1) {
      dispatch(deselectAll(noteNumber))
    }
  }

  function handleRightClick(event) {
    event.preventDefault()
    // TODO: Set to empty
  }

  const hoverClass = (
    (selection.startIdx <= noteNumber && noteNumber <= selection.endIdx) 
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
