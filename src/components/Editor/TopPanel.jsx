import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import "./css/TopPanel.css"
import { setCreateRhythmModalVisibility } from "../../Redux/modalsSlice"
import loadRhythmFromFile from "../../helpers/loadRhythmFromFile"
import InputLabelContainer from "./Sheet/InputLabelContainer"
import { setRhythmTitle } from "../../Redux/rhythmSlice"

export default function TopPanel() {
  const dispatch = useDispatch()
  const rhythmTitle = useSelector(store => store.rhythm.title)

  function showCreateNewRhythmModal() {
    dispatch(setCreateRhythmModalVisibility(true))
  }
  
  function importRhythm(event) {
    console.log("IMPORTING: ", event)
    loadRhythmFromFile(event.target.files[0], dispatch)
  }

  function onRhythmTitleEdited(newTitle) {
    dispatch(setRhythmTitle(newTitle))
  }

  return (
    <div className="top-panel">
      {/* <label className="label-button button">
          Import
          <input type="file" id="import-btn" accept=".json" onChange={importRhythm} />
      </label> */}

      <div className="rhythms-collection">
        <button className="icon-btn"><img src="/assets/svg/ui/library.svg" alt="Show collection" /></button>
        <button className="icon-btn" onClick={showCreateNewRhythmModal}>
          <img src="/assets/svg/ui/add-document.svg" alt="create rhythm" />
        </button>
      </div>

      <div className="rhythm-management">
        <button className="icon-btn">
          <img src="/assets/svg/ui/settings.svg" alt="Rhythm settings" />
        </button>
        <InputLabelContainer className="rhythm-title" text={rhythmTitle} editCallback={onRhythmTitleEdited} />
      </div>

      <div className="sharing-section">
        <button className="icon-btn">
          <img src="/assets/svg/ui/cloud-check.svg" alt="Rhythm saved in cloud" />
        </button>
        <button className="icon-btn">
          <img src="/assets/svg/ui/share.svg" alt="Share rhythm" />
        </button>
        <button className="icon-btn">
          <img src="/assets/svg/ui/user.svg" alt="Profile options" />
        </button>
        {/* <button onClick={showExportModal}>Export</button> */}
      </div>
    </div>
  )

}