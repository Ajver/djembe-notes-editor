import React, { useState } from 'react'
import "./css/Beat.css"
import Note from "./Note"

export default function Beat({beatDef}) {
  return (
    <div className="beat" beat-type={beatDef.type}>
      {beatDef.notes.map((noteSymbol, idx) => (<Note key={idx} noteSymbol={noteSymbol} />))}
    </div>
  )
}
