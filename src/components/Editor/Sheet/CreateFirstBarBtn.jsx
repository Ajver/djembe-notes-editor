import React from 'react'
import "./css/CreateFirstBarBtn.css"
import { useDispatch } from "react-redux"
import { injectBarAtBeatIdx } from "../../../Redux/rhythmSlice"


export default function CreateFirstBarBtn() {
  const dispatch = useDispatch()

  function createBar() {
    dispatch(injectBarAtBeatIdx(0))
  }

  return (
    <button className="create-first-bar-btn editor-only" onClick={createBar}>
      <img src="assets/svg/ui/plus-circle.svg" alt="Create bar" />
      add first bar
    </button>
  )
}
