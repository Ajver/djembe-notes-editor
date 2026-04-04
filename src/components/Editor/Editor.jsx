import { useRef, useState } from 'react'
import SheetsContainer from "./SheetsContainer"
import "./css/Editor.css"
import NotesEditor from "./NotesEditor"
import LocalStorageSaver from "./LocalStorageSaver"
import ExportModal from "./ExportModal"
import CreateRhythmModal from "./CreateRhythmModal"
import Player from "./Player"
import LayoutBuilder from "./LayoutBuilder"
import RhythmEditHistoryManager from "./RhythmEditHistoryManager"
import TopPanel from "./TopPanel"
import BottomPanel from "./BottomPanel"
import RhythmSettingsModal from "./RhythmSettingsModal"
import RhythmLoadingManager from './RhythmLoadingManager'


export default function Editor() {
  const sheetsContainerRef = useRef()

  const [initiallyLoaded, setInitiallyLoaded] = useState(false)

  return (
    <div className="editor">
      {
        initiallyLoaded
        ? (<>
          <LocalStorageSaver />
          <NotesEditor />
          <RhythmEditHistoryManager />
          <Player />
        </>)
        : (<RhythmLoadingManager setInitiallyLoaded={setInitiallyLoaded} />)
      }
      <LayoutBuilder />

      <TopPanel />
      <SheetsContainer mode={"editor"} ref={sheetsContainerRef} />

      <BottomPanel />
      
      <ExportModal />
      <CreateRhythmModal />
      <RhythmSettingsModal />
    </div>
  )
}
