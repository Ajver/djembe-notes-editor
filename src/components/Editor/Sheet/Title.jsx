import React from 'react'
import InputLabelContainer from "./InputLabelContainer"
import "./css/Title.css"
import { useDispatch, useSelector } from "react-redux"
import { setRhythmTitle } from "../../../Redux/rhythmSlice"

export default function Title() {
  const title = useSelector(store => store.rhythm.title)
  const dispatch = useDispatch()

  return (
    <InputLabelContainer className="title" text={title} editCallback={(newTitle) => dispatch(setRhythmTitle(newTitle))} />
  )
}
