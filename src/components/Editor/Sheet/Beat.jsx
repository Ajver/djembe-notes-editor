import React, { useState } from 'react'
import "./css/Beat.css"
import Note from "./Note"
import { useSelector } from "react-redux"

export default function Beat({instrumentIdx, beatIdx}) {
  const definition = useSelector(store => store.rhythm.definition)
  const beatDef = definition[instrumentIdx][beatIdx]

  if (!beatDef) {
    // Prevent crash when rhythm is re-created, 
    // but all the beats are forced to be re-rendered, before layout is updated
    return null
  }

  return (
    <div className="beat" beat-type={beatDef.type}>
      {beatDef.notes.map((noteSymbol, idx) => (<Note key={idx} instrumentIdx={instrumentIdx} beatIdx={beatIdx} noteIdx={idx} />))}
    </div>
  )
}
