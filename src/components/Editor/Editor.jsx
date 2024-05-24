import React, { useEffect, useRef, useState } from 'react'
import SheetsContainer from "./SheetsContainer"
import "./css/Editor.css"
import NotesEditor from "./NotesEditor"
import loadRhythmFromLocalStorage from "../../helpers/loadRhythmFromLocalStorage"
import LocalStorageSaver from "./LocalStorageSaver"
import ExportModal from "./ExportModal"
import CreateRhythmModal from "./CreateRhythmModal"
import Player from "./Player"
import LayoutBuilder from "./LayoutBuilder"
import { useDispatch } from "react-redux"
import UndoRedoManager from "./UndoRedoManager"
import TopPanel from "./TopPanel"
import BottomPanel from "./BottomPanel"

export default function Editor() {
  const dispatch = useDispatch()
  const sheetsContainerRef = useRef()

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
      
      <BottomPanel sheetsContainerRef={sheetsContainerRef} />
      
      <ExportModal />
      <CreateRhythmModal />
    </div>
  )
}
