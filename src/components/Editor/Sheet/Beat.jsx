import React from 'react'
import "./css/Beat.css"
import Note from "./Note"

export default function Beat({numOfNotes}) {
  return (
    <div className="beat">
      {[...Array(numOfNotes)].map((idx) => (<Note key={idx} fpp={idx} />))}
    </div>
  )
}
