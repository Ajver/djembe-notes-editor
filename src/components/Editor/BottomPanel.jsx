import React from "react";
import "./css/BottomPanel.css"
import PlayContainer from "./PlayContainer";
import TipsPanel from "./TipsPanel";
import { useDispatch, useSelector } from "react-redux";
import { useStyledReactToPrint } from "../../hooks/useStyledReactToPrint";
import { setExportModalVisibility } from "../../Redux/modalsSlice";

export default function BottomPanel({sheetsContainerRef}) {
  const dispatch = useDispatch()
  const rhythmTitle = useSelector(store => store.rhythm.title) 
  const handlePrint = useStyledReactToPrint(sheetsContainerRef, rhythmTitle)

  function showExportModal() {
    dispatch(setExportModalVisibility(true))
  }

  return (
    <>
      <TipsPanel />
      <div className="bottom-panel">
        <div>
          <button className="icon-btn">
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
