import React from 'react'
import "./css/InjectBarBtn.css"
import { useDispatch } from "react-redux"
import { injectBarAtBeatIdx } from "../../../Redux/rhythmSlice"

export default function InjectBarBtn({ beatIdxToInject }) {
  const dispatch = useDispatch()

  function injectBar() {
    console.log("Injecting bar at this idx: ", beatIdxToInject)

    dispatch(injectBarAtBeatIdx(beatIdxToInject))
  }

  return (
    <div className="inject-bar-btn editor-only" onClick={injectBar}></div>
  )
}
