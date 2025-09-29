import React from 'react'
import "./css/PlayContainer.css"
import { useDispatch, useSelector } from "react-redux"
import { togglePlaying, toggleRepeat } from "../../Redux/playerSlice"

export default function PlayContainer() {
  const isPlaying = useSelector(store => store.player.isPlaying)
  const repeat = useSelector(store => store.player.repeat)
  const dispatch = useDispatch()

  function togglePlay() {
    dispatch(togglePlaying())
  }

  function toggleRepeatBtn() {
    dispatch(toggleRepeat())
  }

  return (
    <div className="play-container">
      <button className={"icon-btn " + (repeat && "pressed")} onClick={toggleRepeatBtn}>
        <img src="assets/svg/ui/repeat.svg" alt="Repeat playing" />
      </button>
      <button className="icon-btn" onClick={togglePlay}>{
        isPlaying
        ? (<img src="assets/svg/ui/pause.svg" alt="Stop playing" />)
        : (<img src="assets/svg/ui/play.svg" alt="Play rhythm" />)
      }</button>
    </div>
  )
}
