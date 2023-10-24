import React from 'react'
import "./css/Sheet.css"
import FullScore from "./FullScore"
import Title from "./Title"
import Tempo from "./Tempo"

export default function Sheet({elements}) {
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
    </div>
  )
}
