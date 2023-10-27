import React, { useEffect, useRef, useState } from 'react'
import "./css/ExportModal.css"
import ModalWrapper from "./ModalWrapper"
import { useDispatch, useSelector } from "react-redux"
import { setExportModalVisibility } from "../../Redux/modalsSlice"
import saveRhythmToTxt from "../../helpers/saveRhythmToTxt"

export default function ExportModal() {
  const rhythm = useSelector(store => store.rhythm)
  const rhythmTitle = rhythm.title
  const [fileName, setFileName] = useState(rhythmTitle)
  const exportBtnRef = useRef()

  const isVisible = useSelector(store => store.modals.exportModalVisible)
  const dispatch = useDispatch()

  function generateRhythmFile() {
    const rhythmTxt = saveRhythmToTxt(rhythm)
    console.log("Got rhythm: ", rhythmTxt)
    
    const myBlob = new Blob([rhythmTxt], {type: "application/json"});
    const blobUrl = window.URL.createObjectURL(myBlob);

    exportBtnRef.current.href = blobUrl
  }

  useEffect(() => {
    if (!isVisible) {
      return
    }

    setFileName(rhythmTitle)
    generateRhythmFile()
  }, [isVisible])

  useEffect(() => {
    let fileNameWithExtension = fileName
    if (!fileNameWithExtension.endsWith(".json")) {
      fileNameWithExtension += ".json"
    }

    exportBtnRef.current.download = fileNameWithExtension
  }, [fileName])

  function hide() {
    dispatch(setExportModalVisibility(false))
  }

  function exportRhythm(event) {
    event.preventDefault()

    // Click on export button to download file
    exportBtnRef.current.click()

    hide()
  }

  return (
    <ModalWrapper isVisible={isVisible}>
      <form className="export-modal modal" onSubmit={exportRhythm}>
        <h2>Export rhythm</h2>
        <div className="export-section">
            <p>File name:</p>
            <input 
              type="text" 
              name="export-file-name" 
              id="export-file-name-input" 
              value={fileName} 
              onChange={e => setFileName(e.target.value)} 
            />
        </div>
        <div className="buttons-section">
            <button className="cancel" id="close-export-rhythm-modal-btn" type="reset" onClick={hide}>CANCEL</button>
            <a className="button submit" id="submit-export-rhythm-btn" ref={exportBtnRef} onClick={hide}>EXPORT</a>
        </div>
      </form>
    </ModalWrapper>
  )
}
