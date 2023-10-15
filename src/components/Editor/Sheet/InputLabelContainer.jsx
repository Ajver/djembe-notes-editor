import React from 'react'
import "./css/InputLabelContainer.css"

export default function InputLabelContainer({className, text, onChange}) {
  return (
    <div className={"input-label-container " + className}>
      <p>{text}</p>
      <input type="text" />
    </div>
  )
}
