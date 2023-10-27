import React, { useEffect, useRef } from 'react'
import SheetsContainer from "./SheetsContainer"
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
import { useDispatch, useSelector } from "react-redux"
import { useStyledReactToPrint } from "../../hooks/useStyledReactToPrint"
import { setCanAutosave } from "../../Redux/editorSlice"

export default function Editor() {
  const dispatch = useDispatch()
  const sheetsContainerRef = useRef()

  const rhythmTitle = useSelector(store => store.rhythm.title) 
  const handlePrint = useStyledReactToPrint(sheetsContainerRef, rhythmTitle)

  useEffect(() => {
    // TODO: loadRhythmFromDb() ||
    loadRhythmFromLocalStorage(dispatch)

    // Enable autosaving (after rhytm is loaded)
    dispatch(setCanAutosave(true))
  })
  
  return (
    <div className="editor">
      <LocalStorageSaver />
      <NotesEditor />
      <Player />
      
      <RhythmManagementPanel />
      <SheetsContainer ref={sheetsContainerRef} />
      <PrintContainer triggerPrint={handlePrint} />
      <PlayContainer />
      <TipsPanel />

      <ExportModal />
      <CreateRhythmModal />
    </div>
  )
}
