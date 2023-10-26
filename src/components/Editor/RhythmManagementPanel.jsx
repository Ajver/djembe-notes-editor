import React from 'react'
import "./css/RhythmManagementPanel.css"
import { useDispatch } from "react-redux"
import { setCreateRhythmModalVisibility, setExportModalVisibility } from "../../Redux/modalsSlice"
import loadRhythmFromFile from "../../helpers/loadRhythmFromFile"

export default function RhythmManagementPanel() {
  const dispatch = useDispatch()

  function showCreateNewRhythmModal() {
    dispatch(setCreateRhythmModalVisibility(true))
  }
  
  function importRhythm(event) {
    console.log("IMPORTING: ", event)
    loadRhythmFromFile(event.target.files[0], dispatch)
  }

  function showExportModal() {
    dispatch(setExportModalVisibility(true))
  }

  return (
    <div className="rhythm-management">
      <button onClick={showCreateNewRhythmModal}>Create new rhythm</button>
      <label className="label-button button">
            Import
            <input type="file" id="import-btn" accept=".json" onChange={importRhythm} />
        </label>
        <button onClick={showExportModal}>Export</button>
    </div>
  )
}
