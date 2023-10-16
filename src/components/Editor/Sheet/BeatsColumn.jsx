import React from 'react'
import "./css/BeatsColumn.css"
import Beat from "./Beat"

export default function BeatsColumn({nums}) {
  return (
    <div className="beats-column">
      <Beat numOfNotes={nums[0]} />
      <Beat numOfNotes={nums[1]} />
    </div>
  )
}
