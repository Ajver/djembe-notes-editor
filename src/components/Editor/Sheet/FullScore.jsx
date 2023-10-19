import React from 'react'
import "./css/FullScore.css"
import Bar from './Bar'
import { useSelector } from "react-redux"

export default function FullScore({bars}) {
  const multiInstruments = useSelector(store => store.rhythm.definition.length > 1)
  return (
    <div className={"full-score " + (multiInstruments ? "multi-instruments" : "")}>
      {bars.map((bar, idx) => <Bar key={idx} beats={bar.beats} />)}
    </div>
  )
}
