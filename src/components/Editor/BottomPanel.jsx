import React, { useState } from "react";
import "./css/BottomPanel.css"
import PlayContainer from "./PlayContainer";
import TipsPanel from "./TipsPanel";
import { useDispatch } from "react-redux";
import { setExportModalVisibility } from "../../Redux/modalsSlice";
import useLocalStorage from "../../hooks/useLocalStorage";
import { TIPS_PANEL_VISIBLE_KEY } from "../../constants/LocalStorage";
import PrintingSystem from "./PrintingSystem";

export default function BottomPanel() {
  const dispatch = useDispatch()
  const [tipsVisible, setTipsVisible] = useLocalStorage(TIPS_PANEL_VISIBLE_KEY, true)

  const [beatTypeCount, setBeatTypeCount] = useState(1)

  function decreaseBeatType() {
    setBeatTypeCount(beatTypeCount - 1)
  }

  function increaseBeatType() {
    setBeatTypeCount(beatTypeCount + 1)
  }

  function toggleTipsPanel() {
    setTipsVisible(!tipsVisible)
  }

  function showExportModal() {
    dispatch(setExportModalVisibility(true))
  }

  return (
    <>
      <TipsPanel visible={tipsVisible} toggleVisibility={toggleTipsPanel} />
      <section className="control-panel">
        <section className="beat-type-change">
          <button className="icon-btn" onClick={decreaseBeatType}>
            <img src="/assets/svg/ui/arrow-right.svg" alt="Decrease notes in beat" className="flip-h" />
          </button>
          <div className="beat-type-counter">
            {beatTypeCount}
          </div>
          <button className="icon-btn" onClick={increaseBeatType}>
            <img src="/assets/svg/ui/arrow-right.svg" alt="Increase notes in beat" />
          </button>
        </section>
        <section className="note-symbol-change">
          <button className="icon-btn">
            <img src="/assets/svg/bass.svg" alt="bass" />
          </button>
          <button className="icon-btn">
            <img src="/assets/svg/tone.svg" alt="tone" />
          </button>
          <button className="icon-btn">
            <img src="/assets/svg/cross.svg" alt="slap" />
          </button>
          <button className="icon-btn">
            <img src="/assets/svg/ghost.svg" alt="ghost" />
          </button>
        </section>
      </section>
      <section className="bottom-panel">
        <section>
          <button className="icon-btn" onClick={toggleTipsPanel}>
            <img src="/assets/svg/ui/help.svg" alt="Show or hide tips panel" />
          </button>
        </section>
        <section className="undo-redo-section">
          <button className="icon-btn" title="undo">
            <img src="/assets/svg/ui/undo.svg" alt="undo" />
          </button>
          <button className="icon-btn" title="redo">
            <img src="/assets/svg/ui/undo.svg" alt="redo" className="flip-h" />
          </button>
        </section>
        <PlayContainer />
        <section className="exporting-section">
          <button className="icon-btn" onClick={showExportModal}>
            <img src="/assets/svg/ui/download.svg" alt="Download rhythm definition" />
          </button>
          <PrintingSystem />
        </section>
        <section className="copy-paste-section">
          <button className="icon-btn" title="copy">
            <img src="/assets/svg/ui/copy.svg" alt="copy" />
          </button>
          <button className="icon-btn" title="paste">
            <img src="/assets/svg/ui/paste.svg" alt="paste" />
          </button>
        </section>
      </section>
    </>
  )
}
