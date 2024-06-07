import React from 'react'
import { useState } from "react"
import "./css/EditPopup.css"
import { useSelector } from 'react-redux'


export default function EditPopup() {
  const selectionStartIdx  = useSelector(store => store.editor.selectionStartIdx)
  const selectionEndInstrument  = useSelector(store => store.editor.selectionEndInstrument)

  const [isVisible, setVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <div className="edit-popup"> 
      <p>This is edit popup</p>
    </div>
  )
}