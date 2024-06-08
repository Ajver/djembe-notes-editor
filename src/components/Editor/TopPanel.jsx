import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import "./css/TopPanel.css"
import { setCreateRhythmModalVisibility } from "../../Redux/modalsSlice"
import loadRhythmFromFile from "../../helpers/loadRhythmFromFile"
import { setRhythmTitle } from "../../Redux/rhythmSlice"
import InputLabelContainer from "../Common/InputLabelContainer"

export default function TopPanel() {
  const dispatch = useDispatch()
  
  const [toDesktop, setToDesktop] = useState(document.body.offsetWidth >= 830)

  window.addEventListener("resize", () => {
    setToDesktop(document.body.offsetWidth >= 830)
  })

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
    <>
      { toDesktop 
      ? <DesktopTopPanel
        showCreateNewRhythmModal={showCreateNewRhythmModal}
        importRhythm={importRhythm}
        onRhythmTitleEdited={onRhythmTitleEdited}
      /> 
      : <MobileTopPanel
        showCreateNewRhythmModal={showCreateNewRhythmModal}
        importRhythm={importRhythm}
        onRhythmTitleEdited={onRhythmTitleEdited}
      /> }
    </>
  )
}

function DesktopTopPanel({showCreateNewRhythmModal, importRhythm, onRhythmTitleEdited}) {
  const rhythmTitle = useSelector(store => store.rhythm.title)

  return (
    <div className="top-panel">
      <section className="rhythms-collection">
        <button className="icon-btn"><img src="/assets/svg/ui/library.svg" alt="Show collection" /></button>
        <button className="icon-btn" onClick={showCreateNewRhythmModal}>
          <img src="/assets/svg/ui/create-document.svg" alt="create rhythm" />
        </button>
        <label className="label-button button icon-btn" title="Import rhythm from file">
          <img src="/assets/svg/ui/import.svg" alt="Import rhythm from file" />
          <input type="file" id="import-btn" accept=".json" onChange={importRhythm} />
        </label>
      </section>

      <section className="rhythm-management">
        <button className="icon-btn">
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

function MobileTopPanel({showCreateNewRhythmModal, importRhythm, onRhythmTitleEdited}) {
  const rhythmTitle = useSelector(store => store.rhythm.title)
  const [isMenuVisible, setMenuVisible] = useState(false)

  function toggleMenu() {
    setMenuVisible(!isMenuVisible)
  }

  const menuVisibleClass = isMenuVisible ? "menu-visible" : ""

  return (
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
          <img src="/assets/svg/ui/share.svg" alt="Share rhythm" />
        </button>
      </section>
      <nav className="hamburger-menu">
        <button className="icon-btn"><img src="/assets/svg/ui/library.svg" alt="Show collection" /></button>
        <button className="icon-btn" onClick={showCreateNewRhythmModal}>
          <img src="/assets/svg/ui/create-document.svg" alt="create rhythm" />
        </button>
        <label className="label-button button icon-btn" title="Import rhythm from file">
          <img src="/assets/svg/ui/import.svg" alt="Import rhythm from file" />
          <input type="file" id="import-btn" accept=".json" onChange={importRhythm} />
        </label>
        <button className="icon-btn">
          <img src="/assets/svg/ui/settings.svg" alt="Rhythm settings" />
        </button>
        <button className="icon-btn">
          <img src="/assets/svg/ui/cloud-check.svg" alt="Rhythm saved in cloud" />
        </button>
        <button className="icon-btn">
          <img src="/assets/svg/ui/user.svg" alt="Profile options" />
        </button>
      </nav>
    </div>
  )
}