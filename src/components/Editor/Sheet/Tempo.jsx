import React, { useState } from 'react'
import "./css/Tempo.css"
import InputLabelContainer from "./InputLabelContainer"

export default function Tempo() {
  const [tempo, setTempo] = useState(120)

  function editCallback(newContent) {
    let newTempo = parseInt(newContent)

    if (isNaN(newTempo)) {
        // Invalid input - let's return
        return
    }

    if (newTempo < 10) {
        newTempo = 10
    }

    // Input valid - let's overrdie global settings
    // TODO: Override global settings properly
    // rhythmTempo = newTempo
    setTempo(newTempo)
  }

  return (
    <InputLabelContainer className="tempo" text={tempo + " bpm"} editCallback={editCallback} />
  )
}
