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
  const customLayout = buildLayout(rhythm, containerWidth, true)

  console.log("Layout to print: ", customLayout)

  return (
    <div>
      <button className="icon-btn" onClick={handlePrint}>
        <img src="/assets/svg/ui/print.svg" alt="Print rhythm" />
      </button>
      <div className="printing-system" >
        <SheetsContainer customLayout={customLayout} ref={sheetsContainerRef} />
      </div>
    </div>
  )
}
