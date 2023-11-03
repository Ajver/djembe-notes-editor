import React from 'react'
import "./css/FullScore.css"
import Bar from './Bar'
import { useSelector } from "react-redux"
import InjectBarBtn from "./InjectBarBtn"

export default function FullScore({bars}) {
  const multiInstruments = useSelector(store => store.rhythm.definition.length > 1)
  
  console.log("FullScore Update")

  let injectBarAfterBtn = ""
  let humanBarNumber = ""

  if (bars.length > 0) {
    const firstBarIdx = bars[0].barIdx
    const isFirstFullscore = firstBarIdx == 0

    if (isFirstFullscore) {
      injectBarAfterBtn = <InjectBarBtn beatIdxToInject={0} />
    }else {
      humanBarNumber = <div className="human-bar-number" title="Bar number">{firstBarIdx + 1}</div>
    }
  }

  return (
    <div className={"full-score " + (multiInstruments ? "multi-instruments" : "")}>
      {humanBarNumber}
      {injectBarAfterBtn}
      {bars.map((bar, idx) => <Bar key={idx} barIdx={bar.barIdx} beats={bar.beats} />)}
    </div>
  )
}
