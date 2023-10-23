import React, { useEffect } from 'react'
import ToPrint from "./ToPrint"
import "./css/Editor.css"
import RhythmManagementPanel from "./RhythmManagementPanel"
import PrintContainer from "./PrintContainer"
import TipsPanel from "./TipsPanel"
import PlayContainer from "./PlayContainer"
import NotesEditor from "./NotesEditor"
import loadRhythmFromLocalStorage from "../../helpers/loadRhythmFromLocalStorage"
import LocalStorageSaver from "./LocalStorageSaver"
import ExportModal from "./ExportModal"

export default function Editor() {
  (
    // TODO: loadRhythmFromDb() ||
    loadRhythmFromLocalStorage()
  )

  return (
    <div className="editor">
      <LocalStorageSaver />
      <NotesEditor />
      
      <RhythmManagementPanel />
      <ToPrint />
      <PrintContainer />
      <PlayContainer />
      <TipsPanel />

      <ExportModal />
    </div>
  )
}
