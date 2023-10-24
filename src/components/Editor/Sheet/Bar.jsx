import React from 'react'
import BeatsColumn from "./BeatsColumn"
import "./css/Bar.css"

export default function Bar({beats}) {
  function injectBarAfter() {
    console.log("Injecting bar after this one: ", beats)
  }

  return (
    <div className="bar">
      {beats.map(beatIdx => <BeatsColumn key={beatIdx} beatIdx={beatIdx}/>)}
      <div className="inject-bar-btn editor-only" onClick={injectBarAfter}></div>
    </div>
  )
}
