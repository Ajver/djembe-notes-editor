import React from "react";
import "./css/BottomPanel.css"
import PlayContainer from "./PlayContainer";
import TipsPanel from "./TipsPanel";
import { useDispatch, useSelector } from "react-redux";
import { useStyledReactToPrint } from "../../hooks/useStyledReactToPrint";
import { setExportModalVisibility } from "../../Redux/modalsSlice";
import useLocalStorage from "../../hooks/useLocalStorage";
import { TIPS_PANEL_VISIBLE_KEY } from "../../constants/LocalStorage";

export default function BottomPanel({sheetsContainerRef}) {
  const dispatch = useDispatch()
  const rhythmTitle = useSelector(store => store.rhythm.title) 
  const handlePrint = useStyledReactToPrint(sheetsContainerRef, rhythmTitle)
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
          <button className="icon-btn" onClick={handlePrint}>
            <img src="/assets/svg/ui/print.svg" alt="Print rhythm" />
          </button>
        </div>
      </div>
    </>
  )
}
