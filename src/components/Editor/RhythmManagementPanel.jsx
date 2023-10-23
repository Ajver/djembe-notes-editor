import React from 'react'
import "./css/RhythmManagementPanel.css"
import { useDispatch } from "react-redux"
import { setExportModalVisibility } from "../../Redux/modalsSlice"

export default function RhythmManagementPanel() {
  const dispatch = useDispatch()

  function showExportModal() {
    dispatch(setExportModalVisibility(true))
  }

  return (
    <div className="rhythm-management">
      <button>Create new rhythm</button>
      <label className="label-button button">
            Import
            <input type="file" id="import-btn" accept=".json" />
        </label>
        <button onClick={showExportModal}>Export</button>
    </div>
  )
}
