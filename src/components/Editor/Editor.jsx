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
import { useDispatch } from "react-redux"
import { useReactToPrint } from "react-to-print"

export default function Editor() {
  const dispatch = useDispatch()
  const sheetsContainerRef = useRef()

  const customStyle = `
    .editor-only {
      display: none;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden;
    }
  `

  const handlePrint = useReactToPrint({
    content: () => sheetsContainerRef.current,
    copyStyles: true,
    pageStyle: customStyle,
  })

  function printSheetsContainer() {
    console.log("Printing... ", sheetsContainerRef)
    handlePrint()
  }

  // TODO: loadRhythmFromDb() ||
  loadRhythmFromLocalStorage(dispatch)
  
  return (
    <div className="editor">
      <LocalStorageSaver />
      <NotesEditor />
      <Player />
      
      <RhythmManagementPanel />
      <SheetsContainer ref={sheetsContainerRef} />
      <PrintContainer triggerPrint={printSheetsContainer} />
      <PlayContainer />
      <TipsPanel />

      <ExportModal />
      <CreateRhythmModal />
    </div>
  )
}
