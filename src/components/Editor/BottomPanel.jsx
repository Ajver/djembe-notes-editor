import React from "react";
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

  function toggleTipsPanel() {
    setTipsVisible(!tipsVisible)
  }

  function showExportModal() {
    dispatch(setExportModalVisibility(true))
  }

  return (
    <>
      <TipsPanel visible={tipsVisible} toggleVisibility={toggleTipsPanel} />
      <div className="bottom-panel">
        <div>
          <button className="icon-btn" onClick={toggleTipsPanel}>
            <img src="/assets/svg/ui/help.svg" alt="Show or hide tips panel" />
          </button>
        </div>
        <PlayContainer />
        <div className="exporting-section">
          <button className="icon-btn" onClick={showExportModal}>
            <img src="/assets/svg/ui/download.svg" alt="Download rhythm definition" />
          </button>
          <PrintingSystem />
        </div>
      </div>
    </>
  )
}
