import React, { useState } from 'react'
import "./css/Beat.css"
import Note from "./Note"
import { useDispatch, useSelector } from "react-redux"
import { setBeatType } from "../../../Redux/rhythmSlice"

export default function Beat({instrumentIdx, beatIdx}) {
  const beatDef = useSelector(store => store.rhythm.definition[instrumentIdx][beatIdx])

  return (
    <div className="beat" beat-type={beatDef.type}>
      {beatDef.notes.map((noteSymbol, idx) => (<Note key={idx} instrumentIdx={instrumentIdx} beatIdx={beatIdx} noteIdx={idx} />))}
    </div>
  )
}
