import React from 'react'
import Sheet from "./Sheet/Sheet"
import "./css/SheetsContainer.css"
import { useSelector } from "react-redux"

const SheetsContainer = React.forwardRef((props, ref) => {
  const { mode, customLayout } = props
  const layoutFromStore = useSelector(store => store.layout.layout)

  console.log("Re-rendering SheetsContainer")

  const modeClass = {
    "editor": "edit-mode",
    "printing": "print-mode",
  }[mode]

  console.assert(modeClass, "display mode for SheetsContainer should be defined")

  // If customLayout is passed - it gets priority
  const layout = customLayout || layoutFromStore

  return (
    <div className={"sheets-container " + modeClass} ref={ref}>
      {
        layout.map((sheetStructure, idx) => (
          <Sheet key={idx} id={"sheet-" + idx} elements={sheetStructure.elements} />
        ))
      }
    </div>
  )
})

export default SheetsContainer
