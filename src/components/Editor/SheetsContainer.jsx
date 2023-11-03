import React from 'react'
import Sheet from "./Sheet/Sheet"
import "./css/SheetsContainer.css"
import { useSelector } from "react-redux"

const SheetsContainer = React.forwardRef((_props, ref) => {
  // const rhythmStore = useSelector(store => store.rhythm)
  // const { 
  //   definition,
  //   beatsCount,
  //   beatsInBar,
  // } = rhythmStore
  const layout = useSelector(store => store.layout.layout)

  return (
    <div className="sheets-container" ref={ref}>
      {
        layout.map((sheetStructure, idx) => (
          <Sheet key={idx} id={"sheet-" + idx} elements={sheetStructure.elements} />
        ))
      }
    </div>
  )
})

export default SheetsContainer
