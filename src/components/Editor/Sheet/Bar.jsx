import React from 'react'
import BeatsColumn from "./BeatsColumn"
import "./css/Bar.css"

export default function Bar({beats}) {
  function createBarAfter() {
    console.log("Creating bar after this one: ", beats)
  }

  return (
    <div className="bar">
      {beats.map(beatIdx => <BeatsColumn key={beatIdx} beatIdx={beatIdx}/>)}
      <div className="create-bar-btn editor-only" onClick={createBarAfter}></div>
    </div>
  )
}
