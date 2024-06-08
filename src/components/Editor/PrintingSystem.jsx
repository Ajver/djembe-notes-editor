import SheetsContainer from "./SheetsContainer";
import { useStyledReactToPrint } from "../../hooks/useStyledReactToPrint";
import { useSelector } from "react-redux";
import { useRef } from "react";
import buildLayout from "../../helpers/buildLayout";


export default function PrintingSystem() {
  const sheetsContainerRef = useRef()
  const rhythm = useSelector(store => store.rhythm)
  const rhythmTitle = useSelector(store => store.rhythm.title) 
  const handlePrint = useStyledReactToPrint(sheetsContainerRef, rhythmTitle)

  const containerWidth = 830  // A4 size
  const layout = buildLayout(rhythm, containerWidth, true)

  console.log("Layout to print: ", layout)

  return (
    <div>
      <button className="icon-btn" onClick={handlePrint}>
        <img src="/assets/svg/ui/print.svg" alt="Print rhythm" />
      </button>
      <div className="printing-system" style={{display: "none"}}>
        <SheetsContainer mode="printing" customLayout={layout} ref={sheetsContainerRef} />
      </div>
    </div>
  )
}
