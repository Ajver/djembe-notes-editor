import React from 'react'
import "./css/Tempo.css"
import { useDispatch, useSelector } from "react-redux"
import { setRhytmTempo } from "../../../Redux/rhythmSlice"
import InputLabelContainer from "../../Common/InputLabelContainer"

export default function Tempo() {
  const tempo = useSelector(store => store.rhythm.tempo)
  const dispatch = useDispatch()

  function editCallback(newContent) {
    let newTempo = parseInt(newContent)

    if (isNaN(newTempo)) {
        // Invalid input - let's return
        return
    }

    dispatch(setRhytmTempo(newTempo))
  }

  return (
    <InputLabelContainer className="tempo" text={tempo + " bpm"} editCallback={editCallback} />
  )
}
