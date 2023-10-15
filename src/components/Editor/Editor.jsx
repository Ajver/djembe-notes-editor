import React from 'react'
import ToPrint from "./ToPrint"
import "./css/Editor.css"
import RhythmManagement from "./RhythmManagement"
import PrintContainer from "./PrintContainer"
import TipsPanel from "./TipsPanel"
import PlayContainer from "./PlayContainer"

export default function Editor() {
  return (
    <div className="editor">
      <RhythmManagement />
      <ToPrint />
      <PrintContainer />
      <PlayContainer />
      <TipsPanel />
    </div>
  )
}
