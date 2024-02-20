import React from 'react'
import BeatsColumn from "./BeatsColumn"
import "./css/Bar.css"
import InjectBarBtn from "./InjectBarBtn"
import { useSelector } from "react-redux"
import DeleteBarBtn from "./DeleteBarBtn"

export default function Bar({barIdx, beats}) {
  const currentBarIdx = useSelector(store => store.player.currentBarIdx)
  const isBeingPlayed = barIdx == currentBarIdx
  const playingClass = isBeingPlayed ? "playing" : ""

  return (
    <div className={"bar " + playingClass}>
      {beats.map(beatLayout => <BeatsColumn key={beatLayout.index} beatLayout={beatLayout}/>)}
      <InjectBarBtn beatIdxToInject={beats[beats.length - 1].index + 1} />
      <DeleteBarBtn beatIdxDeleteFrom={beats[0].index} />
    </div>
  )
}
