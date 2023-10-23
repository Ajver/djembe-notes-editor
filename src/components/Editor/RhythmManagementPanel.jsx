import React from 'react'
import "./css/RhythmManagementPanel.css"
import { useDispatch } from "react-redux"
import { setCreateRhythmModalVisibility, setExportModalVisibility } from "../../Redux/modalsSlice"

export default function RhythmManagementPanel() {
  const dispatch = useDispatch()

  function showExportModal() {
    dispatch(setExportModalVisibility(true))
  }

  function showCreateNewRhythmModal() {
    dispatch(setCreateRhythmModalVisibility(true))
  }

  return (
    <div className="rhythm-management">
      <button onClick={showCreateNewRhythmModal}>Create new rhythm</button>
      <label className="label-button button">
            Import
            <input type="file" id="import-btn" accept=".json" />
        </label>
        <button onClick={showExportModal}>Export</button>
    </div>
  )
}
