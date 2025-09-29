import SheetsContainer from "./SheetsContainer";
import { useStyledReactToPrint } from "../../hooks/useStyledReactToPrint";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import buildLayout from "../../helpers/buildLayout";


export default function PrintingSystem({onClickCallback}) {
  // Set this to True, to trigger printing
  const [isPrintingStage, setPrintingStage] = useState(false)

  function startPrinting() {
    setPrintingStage(true)
  }

  function endPrinting() {
    setPrintingStage(false)
  }

  function handleOnClick() {
    onClickCallback && onClickCallback()
    startPrinting()
  }

  function onKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key == "p") {
      // Ctrl + P
      event.preventDefault()
      startPrinting()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <label>
      <button className="icon-btn" onClick={handleOnClick}>
        <img src="assets/svg/ui/print.svg" alt="Print rhythm" />
      </button>
      <span className="print-btn-title mobile-only">Print</span>
      { isPrintingStage && <PrintingContainer endPrintingCallback={endPrinting} /> }
    </label>
  )
}


function PrintingContainer({endPrintingCallback}) {
  // We render separate SheetsContainer in this component, which is invisible.
  // This is only for printing, and we need to make it separate from the main
  // sheets container defined in Editor, because on mobile devices the main
  // sheets container behaves differently (i.e. is mutch smaller than A4 paper sheet)
  // Here we render it independently to device size, as regular set of A4 sheets
  const sheetsContainerRef = useRef()
  const rhythm = useSelector(store => store.rhythm)
  const rhythmTitle = useSelector(store => store.rhythm.title) 
  const toPrint = useStyledReactToPrint(sheetsContainerRef, rhythmTitle)

  const containerWidth = 830  // A4 size
  const layout = buildLayout(rhythm, containerWidth, true)

  useEffect(() => {
    toPrint()
    endPrintingCallback()
  }, [])
  
  return (
    <div style={{display: "none"}}>
      <SheetsContainer mode="printing" customLayout={layout} ref={sheetsContainerRef} />
    </div>
  )
}
