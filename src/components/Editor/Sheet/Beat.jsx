import React from 'react'
import "./css/Beat.css"
import BeatPart from "./BeatPart"

export default function Beat() {
  return (
    <div className="beat">
      <BeatPart />
      <BeatPart />
      <BeatPart />
      <BeatPart />
    </div>
  )
}
