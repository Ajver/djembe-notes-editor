import React from 'react'
import "./css/Note.css"

export default function Note({noteSymbol}) {
  const noteClass = {
    "-": "empty",
    "B": "bass",
    "T": "tone",
    "S": "slap",
    "G": "ghost",
  }[noteSymbol]
  
  return (
    <div className={"note " + noteClass}>
    </div>
  )
}
