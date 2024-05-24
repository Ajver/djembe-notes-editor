import React, { useRef, useState } from 'react'
import "./css/InputLabelContainer.css"

export default function InputLabelContainer({className, text, editCallback}) {
  const inputRef = useRef()
  const [visible, setVisible] = useState(false)
  const [tempText, setTempText] = useState(text)

  function show() {
    setTempText(text)
    setVisible(true)

    setTimeout(() => {
      inputRef.current.focus()
      inputRef.current.select()
    }, 1)
  }

  function onKeyDown(event) {
    if (event.key === "Enter") {
      event.target.blur()
    } else if (event.key === "Escape") {
        // Cancel editing - reset temp-text to text
        inputRef.current.value = text
        inputRef.current.blur()
        setTempText(text)
    }
  }

  function onBlur(event) {
    setVisible(false)
    editCallback(event.target.value)
  }

  return (
    <div 
      className={"input-label-container " + className} 
      onClick={show}
      onKeyDown={onKeyDown}
    >
      <p>{text}</p>
      <input 
        ref={inputRef}
        type="text" 
        value={tempText}
        className={visible ? "visible" : ""} 
        onChange={event => setTempText(event.target.value)}
        onBlur={onBlur}
        autoFocus={true}
      />
    </div>
  )
}
