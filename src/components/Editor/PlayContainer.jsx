import React from 'react'
import "./css/PlayContainer.css"
import { useDispatch, useSelector } from "react-redux"
import { togglePlaying } from "../../Redux/playerSlice"

export default function PlayContainer() {
  const isPlaying = useSelector(store => store.player.isPlaying)
  const dispatch = useDispatch()

  function togglePlay() {
    dispatch(togglePlaying())
  }

  return (
    <div className="play-container">
      <button id="play-btn" onClick={togglePlay}>{
        isPlaying 
        ? "STOP" 
        : "PLAY"
      }</button>
    </div>
  )
}
