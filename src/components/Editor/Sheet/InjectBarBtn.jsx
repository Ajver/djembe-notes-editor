import React from 'react'
import "./css/InjectBarBtn.css"
import { useDispatch } from "react-redux"
import { injectBarAtBeatIdx } from "../../../Redux/rhythmSlice"

export default function InjectBarBtn({ beatIdxToInject }) {
  const dispatch = useDispatch()

  function injectBar() {
    dispatch(injectBarAtBeatIdx(beatIdxToInject))
  }

  return (
    <div className="inject-bar-btn editor-only" onClick={injectBar}>
      <img src="assets/svg/ui/plus-circle.svg" alt="Inject bar" />
    </div>
  )
}
