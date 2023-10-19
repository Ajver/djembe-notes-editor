import React from 'react'
import "./css/BeatsColumn.css"
import Beat from "./Beat"
import { useSelector } from "react-redux"

export default function BeatsColumn({beatIdx}) {
  const rhythmDefinition = useSelector(store => store.rhythm.definition)
  const instrumentsCount = rhythmDefinition.length

  return (
    <div className="beats-column">
      {rhythmDefinition.map((instrumentDef, idx) => (
        <Beat key={idx} beatDef={instrumentDef[beatIdx]} />
      ))}
    </div>
  )
}
