import React from 'react'
import "./css/Sheet.css"
import FullScore from "./FullScore"
import Title from "./Title"
import Tempo from "./Tempo"

export default function Sheet() {
  return (
    <div className="sheet" id="sheet-1">
      <Title />
      <Tempo />
      <FullScore />
    </div>
  )
}
