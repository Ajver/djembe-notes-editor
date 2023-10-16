import React from 'react'
import "./css/Note.css"

export default function Note() {
  const notes = [
    "empty",
    "bass",
    "tone",
    "slap",
    "ghost",
  ]

  const idx = Math.floor(Math.random() * notes.length)

  const name = notes[idx]
  const path = `assets/svg/${name}.svg`

  const noteClass = name

  return (
    <div className={"note " + noteClass}>
    </div>
  )
}
