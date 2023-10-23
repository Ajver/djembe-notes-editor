import React, { useState } from 'react'
import ModalWrapper from "./ModalWrapper"
import { useDispatch, useSelector } from "react-redux"
import { setCreateRhythmModalVisibility } from "../../Redux/modalsSlice"

export default function CreateRhythmModal() {
  const isVisible = useSelector(store => store.modals.createRhythmModalVisible)
  const dispatch = useDispatch()

  function hide() {
    dispatch(setCreateRhythmModalVisibility(false))
  }

  return (
    <ModalWrapper isVisible={isVisible}>
      <div className="create-rhythm-modal modal">
        <h2>Creating new rhythm</h2>
        <p><span className="warning">Warning!</span> The previous rhythm will be deleted! If you don't want to lose it, remember to export it first.</p>
        <div className="preset-selection-container">
          {/* Add your radio buttons here */}
        </div>
        <div className="bars-in-full-score-section">
          <p title="How many rhythms will be played together">Parallel instruments:</p>
          <input type="number" className="bars-in-full-score-input" min="1" max="10" value="1" title="How many rhythms will be played together" />
        </div>
        <div className="buttons-section">
          <button className="cancel" onClick={hide}>CANCEL</button>
          <button className="submit">CREATE</button>
        </div>
      </div>
    </ModalWrapper>
  )
}
