import React, { useEffect, useRef, useState } from 'react'
import "./css/ExportModal.css"
import ModalWrapper from "./ModalWrapper"
import { useDispatch, useSelector } from "react-redux"
import { setExportModalVisibility } from "../../Redux/modalsSlice"
import saveRhythmToTxt from "../../helpers/saveRhythmToTxt"
import { compressAndBase64 } from '../../helpers/textCompressionBase64'

export default function ExportModal() {
  const rhythm = useSelector(store => store.rhythm)
  const rhythmTitle = rhythm.title
  const [fileName, setFileName] = useState(rhythmTitle)
  const exportBtnRef = useRef()

  const [exportRhythmUrl, setExportRhythmUrl] = useState("")
  const [copyConfirmationVisible, setCopyConfirmationVisible] = useState(false)
  
  const isVisible = useSelector(store => store.modals.exportModalVisible)
  const dispatch = useDispatch()

  function generateRhythmFileAndUrl() {
    const rhythmTxt = saveRhythmToTxt(rhythm)
    
    const myBlob = new Blob([rhythmTxt], {type: "application/json"});
    const blobUrl = window.URL.createObjectURL(myBlob);
    exportBtnRef.current.href = blobUrl

    const compressedRhythm = compressAndBase64(rhythmTxt)
    console.log("Compressed rhythm:", compressedRhythm)
    const url = window.location.origin + window.location.pathname + "?v=editor&r=" + compressedRhythm
    setExportRhythmUrl(url)
  }

  useEffect(() => {
    if (!isVisible) {
      return
    }

    setFileName(rhythmTitle)
    generateRhythmFileAndUrl()
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

  function copyRhythmUrlToClipboard() {
    console.log("Copying: ", exportRhythmUrl)
    navigator.clipboard.writeText(exportRhythmUrl)
    setCopyConfirmationVisible(true)
    window.setTimeout(() => {
      setCopyConfirmationVisible(false)
    }, 2000)
  }

  return (
    <ModalWrapper isVisible={isVisible}>
      <form className="export-modal modal" onSubmit={exportRhythm}>
        <h2>Download rhythm</h2>
        <div className="export-section">
            <p>File name:</p>
            <input 
              type="text" 
              name="export-file-name" 
              id="export-file-name-input" 
              value={fileName} 
              onChange={e => setFileName(e.target.value)} 
            />
            <p>Or copy a sharable link:</p>
            <div className="export-link-container">
              <input 
                type="text" 
                name="export-link"
                id="export-link-input" 
                value={exportRhythmUrl} 
                readOnly
                onClick={e => e.target.select()}
              />
              <button type='button' className='copy-rhythm-btn' onClick={copyRhythmUrlToClipboard}>
                <img src="assets/svg/ui/copy.svg" alt="Copy URL" />
              </button>
              <div className={"copy-confirmation-tost" + (copyConfirmationVisible?" visible":"")}>
                <p>Copied to clipboard!</p>
              </div>
            </div>
        </div>
        <div className="buttons-section">
            <button className="cancel" id="close-export-rhythm-modal-btn" type="reset" onClick={hide}>CANCEL</button>
            <a className="button submit" id="submit-export-rhythm-btn" ref={exportBtnRef} onClick={hide}>DOWNLOAD</a>
        </div>
      </form>
    </ModalWrapper>
  )
}
