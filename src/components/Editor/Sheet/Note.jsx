import React from 'react'
import "./css/Note.css"
import { useDispatch, useSelector } from "react-redux"
import { singleSelect, deselectAll, addToSelection } from "../../../Redux/editorSlice"
import { setNote } from "../../../Redux/rhythmSlice"
import { NoteSymbol } from "../../../constants/NoteDef"
import { playNote } from "../../../helpers/playing/playing"

export default function Note({notesOrderIdx}) {
  const noteLocation = useSelector(store => store.layout.notesOrder[notesOrderIdx])
  const { instrumentIdx, beatIdx, noteIdx } = noteLocation

  const selectionStartIdx  = useSelector(store => store.editor.selectionStartIdx)
  const selectionEndIdx  = useSelector(store => store.editor.selectionEndIdx)
  const beatDef = useSelector(store => store.rhythm.definition[instrumentIdx][beatIdx])
  const dispatch = useDispatch()

  const noteSymbol = beatDef.notes[noteIdx]

  function handleClick(event) {
    const symbols = Object.values(NoteSymbol)
    const currentIdx = symbols.findIndex(s => s == noteSymbol)
    const nextIdx = (currentIdx + 1) % symbols.length
    const nextSymbol = symbols[nextIdx]

    dispatch(setNote({
      noteLocation,
      noteSymbol: nextSymbol,
    }))

    playNote(nextSymbol)
  }

  function handleRightClick(event) {
    event.preventDefault()
    dispatch(setNote({ noteLocation, noteSymbol: NoteSymbol.EMPTY }))
  }

  function handleMouseEnter(event) {
    if (event.shiftKey || event.buttons == 1) {
      dispatch(addToSelection(notesOrderIdx))
    }else {
      dispatch(singleSelect(notesOrderIdx))
    }
  }

  function handleMouseLeave(event) {
    if (!event.shiftKey || event.buttons == 1) {
      dispatch(deselectAll())
    }
  }

  const hoverClass = (
    (notesOrderIdx >= selectionStartIdx && notesOrderIdx <= selectionEndIdx) 
    ? "selected"
    : ""
  )

  const imgSrc = {
    "-": "assets/svg/dash.svg",
    "B": "assets/svg/bass.svg",
    "T": "assets/svg/tone.svg",
    "S": "assets/svg/cross.svg",
    "G": "assets/svg/ghost.svg",
  }[noteSymbol]

  return (
    <div 
      className={["note", hoverClass].join(" ")} 
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => e.preventDefault()}
    >
      <img src={imgSrc} alt={noteSymbol} />
      {/* <span>{notesOrderIdx}</span> */}
    </div>
  )
}
