import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import "./css/TopPanel.css"
import { setCreateRhythmModalVisibility, setExportModalVisibility, setRhythmSettingsModalVisibility } from "../../Redux/modalsSlice"
import loadRhythmFromFile from "../../helpers/loadRhythmFromFile"
import { setRhythmTitle } from "../../Redux/rhythmSlice"
import InputLabelContainer from "../Common/InputLabelContainer"
import { MOBILE_MAX_WIDTH } from "../../constants/MobileUi"
import PrintingSystem from './PrintingSystem'

export default function TopPanel() {
  const dispatch = useDispatch()
  
  const [toDesktop, setToDesktop] = useState(window.innerWidth > MOBILE_MAX_WIDTH)

  window.addEventListener("resize", () => {
    setToDesktop(window.innerWidth > MOBILE_MAX_WIDTH)
  })

  function showCreateNewRhythmModal() {
    dispatch(setCreateRhythmModalVisibility(true))
  }

  function showRhythmSettings() {
    dispatch(setRhythmSettingsModalVisibility(true))
  }
  
  function importRhythm(event) {
    loadRhythmFromFile(event.target.files[0], dispatch)
  }

  function onRhythmTitleEdited(newTitle) {
    dispatch(setRhythmTitle(newTitle))
  }

  return (
    <>
      { 
        toDesktop 
        ? <DesktopTopPanel
            showCreateNewRhythmModal={showCreateNewRhythmModal}
            showRhythmSettings={showRhythmSettings}
            importRhythm={importRhythm}
            onRhythmTitleEdited={onRhythmTitleEdited}
          />
        : <MobileTopPanel
            showCreateNewRhythmModal={showCreateNewRhythmModal}
            showRhythmSettings={showRhythmSettings}
            importRhythm={importRhythm}
            onRhythmTitleEdited={onRhythmTitleEdited}
          /> 
      }
    </>
  )
}

function DesktopTopPanel({showCreateNewRhythmModal, showRhythmSettings, importRhythm, onRhythmTitleEdited}) {
  const rhythmTitle = useSelector(store => store.rhythm.title)

  return (
    <div className="top-panel">
      <section className="rhythms-collection">
        <button className="icon-btn"><img src="/assets/svg/ui/library.svg" alt="Show collection" /></button>
        <button className="icon-btn" onClick={showCreateNewRhythmModal}>
          <img src="/assets/svg/ui/create-document.svg" alt="create rhythm" />
        </button>
        <label className="label-button icon-btn" title="Import rhythm from file">
          <img src="/assets/svg/ui/import.svg" alt="Import rhythm from file" />
          <input type="file" id="import-btn" accept=".json" onChange={importRhythm} />
        </label>
      </section>

      <section className="rhythm-management">
        <button className="icon-btn" onClick={showRhythmSettings}>
          <img src="/assets/svg/ui/settings.svg" alt="Rhythm settings" />
        </button>
        <InputLabelContainer 
          className="title-edit" 
          text={rhythmTitle} 
          editCallback={onRhythmTitleEdited}
        />
      </section>

      <section className="sharing-section">
        <button className="icon-btn">
          <img src="/assets/svg/ui/cloud-check.svg" alt="Rhythm saved in cloud" />
        </button>
        <button className="icon-btn">
          <img src="/assets/svg/ui/share.svg" alt="Share rhythm" />
        </button>
        <button className="icon-btn">
          <img src="/assets/svg/ui/user.svg" alt="Profile options" />
        </button>
      </section>
    </div>
  )
}

function MobileTopPanel({showCreateNewRhythmModal, showRhythmSettings, importRhythm, onRhythmTitleEdited}) {
  const rhythmTitle = useSelector(store => store.rhythm.title)
  const [isMenuVisible, setMenuVisible] = useState(false)
  const dispatch = useDispatch()

  function toggleMenu() {
    setMenuVisible(!isMenuVisible)
  }

  function hideMenu() {
    setMenuVisible(false)
  }

  function onCreateRhythmClicked() {
    hideMenu()
    showCreateNewRhythmModal()
  }

  function onExportRhythmClicked() {
    hideMenu()
    dispatch(setExportModalVisibility(true))
  }

  function onRhythmSettingsClicked() {
    hideMenu()
    showRhythmSettings()
  }

  function onBackToCollectionClicked() {
    hideMenu()
    // TODO
  }

  function onShareRhythmClicked() {
    hideMenu()
    // TODO
  }

  function onProfileClicked() {
    hideMenu()
    // TODO
  }

  const menuVisibleClass = isMenuVisible ? "menu-visible" : ""

  return (
    <>
      { isMenuVisible && <div className="dark-background" onClick={hideMenu}></div> }
      <div className={"top-panel " + menuVisibleClass}>
        <section className="top-bar">
          <button className="icon-btn" onClick={toggleMenu}>
            { 
              isMenuVisible 
              ? <img src="/assets/svg/ui/close.svg" alt="Hide main menu" />
              : <img src="/assets/svg/ui/hamburger.svg" alt="Show main menu" />
            }
          </button>
          <InputLabelContainer 
            className="title-edit" 
            text={rhythmTitle} 
            editCallback={onRhythmTitleEdited}
          />
          <button className="icon-btn">
            <img src="/assets/svg/ui/cloud-check.svg" alt="Rhythm saved in cloud" />
          </button>
        </section>
        <nav className="hamburger-menu">
          <label>
            <button className="icon-btn" onClick={onCreateRhythmClicked}>
              <img src="/assets/svg/ui/create-document.svg" alt="create rhythm" />
            </button>
            Create new rhythm
          </label>
          <label className="label-button" title="Import rhythm from file" onClick={hideMenu}>
            <div className="icon-btn" >
              <img src="/assets/svg/ui/import.svg" alt="Import rhythm from file" />
            </div>
            <input type="file" id="import-btn" accept=".json" onChange={importRhythm} />
            Import from file
          </label>
          <label>
            <button className="icon-btn" onClick={onExportRhythmClicked}>
              <img src="/assets/svg/ui/download.svg" alt="Download rhythm definition" />
            </button>
            Save to file
          </label>
          <PrintingSystem onClickCallback={hideMenu} />
          <label>
            <button className="icon-btn" onClick={onRhythmSettingsClicked}>
              <img src="/assets/svg/ui/settings.svg" alt="Rhythm settings" />
            </button>
            Rhythm settings
          </label>
          <label>
            <button className="icon-btn" onClick={onBackToCollectionClicked}>
              <img src="/assets/svg/ui/library.svg" alt="Back to collection" />
            </button>
            Back to collection
          </label>
          <label>
            <button className="icon-btn" onClick={onShareRhythmClicked}>
              <img src="/assets/svg/ui/share.svg" alt="Share rhythm" />
            </button>
            Share rhythm
          </label>
          <label>
            <button className="icon-btn" onClick={onProfileClicked}>
              <img src="/assets/svg/ui/user.svg" alt="Profile options" />
            </button>
            Profile
          </label>
        </nav>
      </div>
    </>
  )
}