import React, { useState } from 'react';
import ModalWrapper from "./ModalWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setCreateRhythmModalVisibility } from "../../Redux/modalsSlice";
import './css/CreateRhythmModal.css';
import { createNewRhythm } from "../../Redux/rhythmSlice";

export default function CreateRhythmModal() {
  const [instrumentsAmount, setInstrumentsAmount] = useState(1)
  const [selectedPreset, setSelectedPreset] = useState("4-4")

  const isVisible = useSelector(store => store.modals.createRhythmModalVisible)
  const dispatch = useDispatch()

  function hide() {
    dispatch(setCreateRhythmModalVisibility(false))
  }

  function submitCreation(event) {
    event.preventDefault()

    console.log("Creating rhythm", selectedPreset, instrumentsAmount)

    dispatch(createNewRhythm({
      preset: selectedPreset,
      instrumentsAmount: instrumentsAmount,
    }))
    
    hide()
  }

  return (
    <ModalWrapper isVisible={isVisible}>
      <form className="create-rhythm-modal modal" onSubmit={submitCreation}>
        <h2>Creating new rhythm</h2>
        <p><span className="warning">Warning!</span> The previous rhythm will be deleted! If you don't want to lose it, remember to export it first.</p>
        <div className="preset-selection-container" onChange={e => setSelectedPreset(e.target.value)}>
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-4-4" value="4-4" defaultChecked />
          <label htmlFor="preset-4-4" title="4 single beats in bar">
              4/4
          </label>
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-3-4" value="3-4" />
          <label htmlFor="preset-3-4" title="3 single beats in bar">
              3/4
          </label>
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-8-4" value="8-4" />
          <label htmlFor="preset-8-4" title="4 double beats in bar">
              8/4
          </label>
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-12-8" value="12-8" />
          <label htmlFor="preset-12-8" title="4 triplet beats in bar">
              12/8
          </label>
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-9-8" value="9-8" />
          <label htmlFor="preset-9-8" title="3 triplet beats in bar">
              9/8
          </label>
        </div>
        <div className="bars-in-full-score-section">
          <p title="How many rhythms will be played together">Parallel instruments:</p>
          <input 
            type="number" 
            className="bars-in-full-score-input" 
            min="1" 
            max="10" 
            value={instrumentsAmount} 
            onChange={e => setInstrumentsAmount(e.target.value)}
            title="How many rhythms will be played together" 
          />
        </div>
        <div className="buttons-section">
          <button className="cancel" type="reset" onClick={hide}>CANCEL</button>
          <button className="submit" type="submit">CREATE</button>
        </div>
      </form>
    </ModalWrapper>
  )
}
