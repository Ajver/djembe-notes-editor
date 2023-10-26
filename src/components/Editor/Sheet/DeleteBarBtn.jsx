import React from 'react'
import "./css/DeleteBarBtn.css"
import { useDispatch } from "react-redux"
import { deleteBar } from "../../../Redux/rhythmSlice"

export default function DeleteBarBtn({beatIdxDeleteFrom}) {
  const dispatch = useDispatch()
  
  function handleBarDeletion() {
    dispatch(deleteBar(beatIdxDeleteFrom))
  }

  return (
    <button className="delete-bar-btn editor-only" onClick={handleBarDeletion}></button>
  )
}
