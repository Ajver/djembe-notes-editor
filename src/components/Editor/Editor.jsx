import React, { useEffect, useRef, useState } from 'react'
import SheetsContainer from "./SheetsContainer"
import "./css/Editor.css"
import PrintContainer from "./PrintContainer"
import TipsPanel from "./TipsPanel"
import PlayContainer from "./PlayContainer"
import NotesEditor from "./NotesEditor"
import loadRhythmFromLocalStorage from "../../helpers/loadRhythmFromLocalStorage"
import LocalStorageSaver from "./LocalStorageSaver"
import ExportModal from "./ExportModal"
import CreateRhythmModal from "./CreateRhythmModal"
import Player from "./Player"
import LayoutBuilder from "./LayoutBuilder"
import { useDispatch, useSelector } from "react-redux"
import { useStyledReactToPrint } from "../../hooks/useStyledReactToPrint"
import UndoRedoManager from "./UndoRedoManager"
import TopPanel from "./TopPanel"

export default function Editor() {
  const dispatch = useDispatch()
  const sheetsContainerRef = useRef()

  const rhythmTitle = useSelector(store => store.rhythm.title) 
  const handlePrint = useStyledReactToPrint(sheetsContainerRef, rhythmTitle)

  const [initiallyLoaded, setInitiallyLoaded] = useState(false)

  useEffect(() => {
    // TODO: loadRhythmFromDb() ||
    loadRhythmFromLocalStorage(dispatch)

    setInitiallyLoaded(true)
  })

  return (
    <div className="editor">
      {
        initiallyLoaded
        && <>
          <LocalStorageSaver />
          <NotesEditor />
          <UndoRedoManager />
          <Player />
        </>
      }
      <LayoutBuilder />
      
      <TopPanel />
      <SheetsContainer ref={sheetsContainerRef} />
      <PrintContainer triggerPrint={handlePrint} />
      <PlayContainer />
      <TipsPanel />

      <ExportModal />
      <CreateRhythmModal />
    </div>
  )
}
