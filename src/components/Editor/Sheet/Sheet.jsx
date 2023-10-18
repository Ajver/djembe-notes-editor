import React from 'react'
import "./css/Sheet.css"
import FullScore from "./FullScore"
import Title from "./Title"
import Tempo from "./Tempo"
import { useDispatch, useSelector } from "react-redux"
import { addBar } from "../../../Redux/rhythmSlice"

export default function Sheet() {
  const beatsCount = useSelector(store => store.rhythm.beatsCount)
  const rhythmDefinition = useSelector(store => store.rhythm.definition)
  const beatsInBar = useSelector(store => store.rhythm.beatsInBar)
  const dispatch = useDispatch()

  return (
    <div className="sheet">
      <Title />
      <Tempo />
      {/* {  // TODO: Display beats
        [...Array(beatsCount)].map((idx) => {
          return <></>
        })
      } */}
      <FullScore />
      <button onClick={() => dispatch(addBar())}>Add full score</button>
    </div>
  )
}
