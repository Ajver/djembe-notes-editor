import React from 'react'
import "./css/PrintContainer.css"

export default function PrintContainer({triggerPrint}) {
  return (
    <div className="print-container">
      <button className="print-btn" onClick={triggerPrint}>PRINT</button>
    </div>
  )
}
