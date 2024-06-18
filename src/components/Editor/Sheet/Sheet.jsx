import React from 'react'
import "./css/Sheet.css"
import FullScore from "./FullScore"
import Title from "./Title"
import Tempo from "./Tempo"
import CreateFirstBarBtn from "./CreateFirstBarBtn"

function _isLayoutEmpty(elements) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    if (element.type == "full-score") {
      // The first full score

      const isEmpty = element.bars.length == 0
      return isEmpty
    }
  }

  // No fullscores found
  return true
}


export default function Sheet({elements}) {
  const showCreateBarBtn = _isLayoutEmpty(elements)
  console.log(showCreateBarBtn)

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
      { showCreateBarBtn && <CreateFirstBarBtn /> }
    </div>
  )
}
