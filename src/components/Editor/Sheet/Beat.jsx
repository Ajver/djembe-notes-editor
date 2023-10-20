import React, { useState } from 'react'
import "./css/Beat.css"
import Note from "./Note"
import { useDispatch, useSelector } from "react-redux"
import { setBeatType } from "../../../Redux/rhythmSlice"

export default function Beat({instrumentIdx, beatIdx}) {
  const beatDef = useSelector(store => store.rhythm.definition[instrumentIdx][beatIdx])
  const dispath = useDispatch()

  function handleClick(event) {
    const types = [
      "single",
      "double",
      "triplet",
      "quartet",
    ]
    const currentIdx = types.findIndex(t => t == beatDef.type)
    const nextIdx = (currentIdx + 1) % types.length
    const nextType = types[nextIdx]
    dispath(setBeatType({
      instrumentIdx,
      beatIdx,
      newType: nextType,
    }))
    console.log(instrumentIdx, beatIdx, event, nextType)
  }

  return (
    <div className="beat" beat-type={beatDef.type} onClick={handleClick}>
      {beatDef.notes.map((noteSymbol, idx) => (<Note key={idx} instrumentIdx={instrumentIdx} beatIdx={beatIdx} noteIdx={idx} />))}
    </div>
  )
}
