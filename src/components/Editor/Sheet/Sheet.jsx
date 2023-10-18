import React from 'react'
import "./css/Sheet.css"
import FullScore from "./FullScore"
import Title from "./Title"
import Tempo from "./Tempo"
import { useDispatch } from "react-redux"
import { addFullScore } from "../../../Redux/rhythmSlice"

export default function Sheet() {
  const dispatch = useDispatch()

  return (
    <div className="sheet" id="sheet-1">
      <Title />
      <Tempo />
      <FullScore />
      <FullScore />
      <button onClick={() => dispatch(addFullScore())}>Add full score</button>
    </div>
  )
}
