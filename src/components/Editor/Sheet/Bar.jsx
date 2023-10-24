import React from 'react'
import BeatsColumn from "./BeatsColumn"
import "./css/Bar.css"
import InjectBarBtn from "./InjectBarBtn"
import { useSelector } from "react-redux"

export default function Bar({barIdx, beats}) {
  const currentBarIdx = useSelector(store => store.player.currentBarIdx)
  const isBeingPlayed = barIdx == currentBarIdx
  const playingClass = isBeingPlayed ? "playing" : ""
  
  return (
    <div className={"bar " + playingClass}>
      {beats.map(beatIdx => <BeatsColumn key={beatIdx} beatIdx={beatIdx}/>)}
      <InjectBarBtn beatIdxToInject={beats[beats.length - 1] + 1} />
    </div>
  )
}
