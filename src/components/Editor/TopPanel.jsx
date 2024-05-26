import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import "./css/TopPanel.css"
import { setCreateRhythmModalVisibility } from "../../Redux/modalsSlice"
import loadRhythmFromFile from "../../helpers/loadRhythmFromFile"
import { setRhythmTitle } from "../../Redux/rhythmSlice"
import InputLabelContainer from "../Common/InputLabelContainer"

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
      <div className="rhythms-collection">
        <button className="icon-btn"><img src="/assets/svg/ui/library.svg" alt="Show collection" /></button>
        <button className="icon-btn" onClick={showCreateNewRhythmModal}>
          <img src="/assets/svg/ui/create-document.svg" alt="create rhythm" />
        </button>
        <label className="label-button button icon-btn" title="Import rhythm from file">
          <img src="/assets/svg/ui/import.svg" alt="Import rhythm from file" />
          <input type="file" id="import-btn" accept=".json" onChange={importRhythm} />
        </label>
      </div>

      <div className="rhythm-management">
        <button className="icon-btn">
          <img src="/assets/svg/ui/settings.svg" alt="Rhythm settings" />
        </button>
        <InputLabelContainer 
          className="title-edit" 
          text={rhythmTitle} 
          editCallback={onRhythmTitleEdited}
        />
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
      </div>
    </div>
  )

}