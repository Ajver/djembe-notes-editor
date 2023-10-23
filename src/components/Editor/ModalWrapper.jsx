import React from 'react'
import "./css/ModalWrapper.css"

export default function ModalWrapper({ children, isVisible }) {
  const visibleClass = isVisible ? "modal-visible" : ""
  
  return (
    <div className={"modal-wrapper " + visibleClass}>
      {children}
    </div>
  )
}
