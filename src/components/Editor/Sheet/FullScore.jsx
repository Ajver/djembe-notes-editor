import React from 'react'
import "./css/FullScore.css"
import Bar from './Bar'
import { useSelector } from "react-redux"

export default function FullScore({bars}) {
  const multiInstruments = useSelector(store => store.rhythm.definition.length > 1)
  
  let humanBarNumber = ""

  if (bars.length > 0) {
    const number = bars[0].humanBarNumber

    if (number > 1) {
      humanBarNumber = <div className="human-bar-number" title="Bar number">{number}</div>
    }
  }

  return (
    <div className={"full-score " + (multiInstruments ? "multi-instruments" : "")}>
      {humanBarNumber}
      {bars.map((bar, idx) => <Bar key={idx} beats={bar.beats} />)}
    </div>
  )
}
