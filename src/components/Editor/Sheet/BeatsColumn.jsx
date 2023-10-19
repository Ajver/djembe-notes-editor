import React from 'react'
import "./css/BeatsColumn.css"
import Beat from "./Beat"
import { useSelector } from "react-redux"

export default function BeatsColumn({beatIdx}) {
  const rhythmDefinition = useSelector(store => store.rhythm.definition)

  return (
    <div className="beats-column">
      {rhythmDefinition.map((_, idx) => (
        <Beat key={idx} instrumentIdx={idx} beatIdx={beatIdx} />
      ))}
    </div>
  )
}
