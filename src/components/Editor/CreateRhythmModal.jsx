import React, { useState } from 'react';
import ModalWrapper from "./ModalWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setCreateRhythmModalVisibility } from "../../Redux/modalsSlice";
import './css/CreateRhythmModal.css';

export default function CreateRhythmModal() {
  const [parallelInstruments, setParallelInstruments] = useState(1)

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
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-4-4" value="4-4" defaultChecked />
          <label htmlFor="preset-4-4" title="4 beats in bar, 4 parts in each beat">
              4/4
          </label>
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-3-4" value="3-4" />
          <label htmlFor="preset-3-4" title="3 beats in bar, 4 parts in each beat">
              3/4
          </label>
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-12-8" value="12-8" />
          <label htmlFor="preset-12-8" title="4 beats in bar, 3 parts in each beat">
              12/8
          </label>
          <input type="radio" className="preset" name="preset-selection-btn" id="preset-9-8" value="9-8" />
          <label htmlFor="preset-9-8" title="3 beats in bar, 3 parts in each beat">
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
            value={parallelInstruments} 
            onChange={e => setParallelInstruments(e.target.value)}
            title="How many rhythms will be played together" 
          />
        </div>
        <div className="buttons-section">
          <button className="cancel" onClick={hide}>CANCEL</button>
          <button className="submit">CREATE</button>
        </div>
      </div>
    </ModalWrapper>
  )
}
