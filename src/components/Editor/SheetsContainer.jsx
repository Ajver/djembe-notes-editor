import React from 'react'
import Sheet from "./Sheet/Sheet"
import "./css/SheetsContainer.css"
import { useSelector } from "react-redux"

const SheetsContainer = React.forwardRef((props, ref) => {
  const layoutFromStore = useSelector(store => store.layout.layout)
  const customLayout = props.customLayout

  // If customLayout is passed - it gets priority
  const layout = customLayout || layoutFromStore

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
