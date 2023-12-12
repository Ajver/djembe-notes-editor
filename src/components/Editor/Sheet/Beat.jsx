import React, { useState } from 'react'
import "./css/Beat.css"
import Note from "./Note"
import { useSelector } from "react-redux"

export default function Beat({instrumentIdx, beatLayout}) {
  const beatIdx = beatLayout.index
  const definition = useSelector(store => store.rhythm.definition)
  const beatDef = definition[instrumentIdx][beatIdx]
  const notesOrder = useSelector(store => store.layout.notesOrder)
  const notes = beatLayout.notesPerInstrument[instrumentIdx]

  if (!beatDef) {
    // Prevent crash when rhythm is re-created, 
    // but all the beats are forced to be re-rendered, before layout is updated
    return null
  }

  if (!notes) {
    // Prevent crash when rhythm is re-created, 
    // but all the beats are forced to be re-rendered, before layout is updated
    return null
  }
  
  return (
    <div className="beat" beat-type={beatDef.type}>
      {
        notes.map(notesOrderIdx => {
          const noteIdx = notesOrder[notesOrderIdx].noteIdx
          return (
            <Note key={notesOrderIdx} instrumentIdx={instrumentIdx} beatIdx={beatIdx} noteIdx={noteIdx} notesOrderIdx={notesOrderIdx} />
          )
        })
      }
    </div>
  )
}
