import React from 'react'
import ToPrint from "./ToPrint"
import "./css/Editor.css"
import RhythmManagementPanel from "./RhythmManagementPanel"
import PrintContainer from "./PrintContainer"
import TipsPanel from "./TipsPanel"
import PlayContainer from "./PlayContainer"
import NotesEditor from "./NotesEditor"

export default function Editor() {
  return (
    <div className="editor">
      <NotesEditor />
      

      <RhythmManagementPanel />
      <ToPrint />
      <PrintContainer />
      <PlayContainer />
      <TipsPanel />
    </div>
  )
}
