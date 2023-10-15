import React, { useState } from 'react'
import "./css/Tempo.css"
import InputLabelContainer from "./InputLabelContainer"

export default function Tempo() {
  const [tempo, setTempo] = useState(120)

  return (
    <InputLabelContainer className="tempo" text={tempo + " bpm"} onChange={setTempo} />
  )
}
