import React from 'react'
import "./css/Sheet.css"
import FullScore from "./FullScore"
import Title from "./Title"
import Tempo from "./Tempo"
import { useDispatch, useSelector } from "react-redux"
import { addBar } from "../../../Redux/rhythmSlice"

export default function Sheet({elements}) {
  const beatsCount = useSelector(store => store.rhythm.beatsCount)
  const rhythmDefinition = useSelector(store => store.rhythm.definition)
  const beatsInBar = useSelector(store => store.rhythm.beatsInBar)
  const dispatch = useDispatch()

  return (
    <div className="sheet">
      {
        elements.map((element, idx) => {
          switch (element.type) {
            case "title":
              return <Title key={idx} />
            case "tempo":
              return <Tempo key={idx} />
            case "full-score":
              return <FullScore key={idx} bars={element.bars} />
            default:
              console.error("Unknown type:", element.type)
          }
        })
      }
      <button onClick={() => dispatch(addBar())}>Add Bar</button>
    </div>
  )
}
