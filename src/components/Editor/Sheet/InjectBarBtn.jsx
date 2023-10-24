import React from 'react'
import "./css/InjectBarBtn.css"

export default function InjectBarBtn({ beatIdxToInject }) {
  function injectBar() {
    console.log("Injecting bar after this one: ", beatIdxToInject)
  }

  return (
    <div className="inject-bar-btn editor-only">
      
    </div>
  )
}
