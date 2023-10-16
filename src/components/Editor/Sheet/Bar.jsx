import React from 'react'
import BeatsColumn from "./BeatsColumn"
import "./css/Bar.css"

export default function Bar({nums}) {
  return (
    <div className="bar">
      <BeatsColumn nums={nums[0]} key={0} />
      <BeatsColumn nums={nums[1]} key={1} />
      <BeatsColumn nums={nums[2]} key={2} />
      <BeatsColumn nums={nums[3]} key={3} />
    </div>
  )
}
