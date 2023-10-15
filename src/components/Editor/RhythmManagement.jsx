import React from 'react'
import "./css/RhythmManagement.css"

export default function RhythmManagement() {
  return (
    <div className="rhythm-management">
      <button>Create new rhythm</button>
      <label className="label-button button">
            Import
            <input type="file" id="import-btn" accept=".json" />
        </label>
        <button>Export</button>
    </div>
  )
}
