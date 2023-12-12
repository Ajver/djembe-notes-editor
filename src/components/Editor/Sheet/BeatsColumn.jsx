import React from 'react'
import "./css/BeatsColumn.css"
import Beat from "./Beat"
import { useSelector } from "react-redux"

export default function BeatsColumn({beatLayout}) {
  const rhythmDefinition = useSelector(store => store.rhythm.definition)

  return (
    <div className="beats-column">
      {rhythmDefinition.map((_, instrumentIdx) => (
        <Beat key={instrumentIdx} instrumentIdx={instrumentIdx} beatLayout={beatLayout} />
      ))}
    </div>
  )
}
