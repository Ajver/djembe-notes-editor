import React, { useState } from 'react'
import "./css/InputLabelContainer.css"

export default function InputLabelContainer({className, text, editCallback}) {
  const [visible, setVisible] = useState(false)
  
  function show() {
    setVisible(true)
    
    // TODO: Deselect all notes
    // Fixes bug when one can edit label with notes selected
  }

  function handleFocus(event) {
    event.target.select()
  }

  function onKeyDown(event) {
    if (event.key === "Enter") {
      event.target.blur()
    } else if (event.key === "Escape") {
        // Cancel editing
        event.target.value = rhythmTitle
        event.target.blur()
    }
  }

  function onBlur(event) {
    setVisible(false)
    editCallback(input.value)
    // if (newContent === undefined) {
    //     label.innerHTML = input.value
    // }else {
    //     // Custom input content
    //     label.innerHTML = newContent
    // }
  }

  return (
    <div 
    className={"input-label-container " + className} 
    onClick={show}
    onKeyDown={onKeyDown}
    >
      <p>{text}</p>
      <input 
        type="text" 
        value={text}
        className={visible ? "visible" : ""} 
        onChange={event => onChange(event.target.value)}
        onFocus={handleFocus}
        onBlur={onBlur}
      />
    </div>
  )
}
