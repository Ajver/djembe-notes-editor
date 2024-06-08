import SheetsContainer from "./SheetsContainer";
import { useStyledReactToPrint } from "../../hooks/useStyledReactToPrint";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import buildLayout from "../../helpers/buildLayout";


export default function PrintingSystem() {
  // Set this to True, to trigger printing
  const [isPrintingStage, setPrintingStage] = useState(false)

  return (
    <div>
      <button className="icon-btn" onClick={() => setPrintingStage(true)}>
        <img src="/assets/svg/ui/print.svg" alt="Print rhythm" />
      </button>
      { isPrintingStage && <PrintingContainer endPrintingStageCallback={() => setPrintingStage(false)} /> }
    </div>
  )
}


function PrintingContainer({endPrintingStageCallback}) {
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
    endPrintingStageCallback()
  }, [])
  
  return (
    <div style={{display: "none"}}>
      <SheetsContainer mode="printing" customLayout={layout} ref={sheetsContainerRef} />
    </div>
  )
}
