import React from 'react'
import BeatsColumn from "./BeatsColumn"
import "./css/Bar.css"
import InjectBarBtn from "./InjectBarBtn"

export default function Bar({beats}) {
  return (
    <div className="bar">
      {beats.map(beatIdx => <BeatsColumn key={beatIdx} beatIdx={beatIdx}/>)}
      <InjectBarBtn />
    </div>
  )
}
