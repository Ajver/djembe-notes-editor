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
import CreateRhythmModal from "./CreateRhythmModal"
import Player from "./Player"
import { useDispatch } from "react-redux"

export default function Editor() {
  const dispatch = useDispatch()
  
  // TODO: loadRhythmFromDb() ||
  loadRhythmFromLocalStorage(dispatch)

  return (
    <div className="editor">
      <LocalStorageSaver />
      <NotesEditor />
      <Player />
      
      <RhythmManagementPanel />
      <ToPrint />
      <PrintContainer />
      <PlayContainer />
      <TipsPanel />

      <ExportModal />
      <CreateRhythmModal />
    </div>
  )
}
