import React, { useState } from 'react'
import "./css/Beat.css"
import Note from "./Note"

export default function Beat({numOfNotes}) {
  const tempType = {
    1: "single",
    2: "double",
    3: "triplet",
    4: "quartet",
  }[numOfNotes]

  const [beatType, _setBeatType] = useState(tempType)

  return (
    <div className="beat" beat-type={beatType}>
      {[...Array(numOfNotes)].map((idx) => (<Note key={idx} />))}
    </div>
  )
}
