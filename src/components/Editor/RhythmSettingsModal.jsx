import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./css/RhythmSettingsModal.css"
import ModalWrapper from "./ModalWrapper";
import { useState } from "react";
import { BeatType } from "../../constants/BeatDef";
import { setRhythmSettingsModalVisibility } from "../../Redux/modalsSlice";
import { setBeatsInBar, setDefaultBeatType } from "../../Redux/rhythmSlice";


export default function RhythmSettingsModal() {
  const dispatch = useDispatch()
  const isVisible = useSelector(store => store.modals.rhythmSettingsModalVisible)
  const defaultBeatType = useSelector(store => store.rhythm.defaultBeatType)
  const defaultBeatsInBar = useSelector(store => store.rhythm.beatsInBar)

  const [tempBeatType, setTempBeatType] = useState(defaultBeatType)
  const [tempBeatsInBar, setTempBeatsInBar] = useState(defaultBeatsInBar)

  function hide() {
    dispatch(setRhythmSettingsModalVisibility(false))
  }

  function cancel() {
    // Reset settings
    setTempBeatType(defaultBeatType)
    setTempBeatsInBar(defaultBeatsInBar)

    hide()
  }

  function save() {
    console.log("Saving settings")

    dispatch(setDefaultBeatType(tempBeatType))
    dispatch(setBeatsInBar(tempBeatsInBar))

    hide()
  }

  return (
    <ModalWrapper isVisible={isVisible}>
      <div className="rhythm-settings-modal modal">
        <h2>Rhythm settings</h2>
        <section className="beat-edit-section">
          <h3>Default beat type</h3>
          <p>(applies to newly created bars)</p>
          <div className="beat-type-selection-container">
          {Object.values(BeatType).map((beatType) => (
            <React.Fragment key={beatType}>
              <input 
                type="radio" 
                className="choose-beat-type-btn" 
                name="choose-beat-type-btn" 
                id={`beat-type-${beatType}`} 
                value={beatType} 
                onChange={e => setTempBeatType(e.target.value)}
                checked={beatType === tempBeatType}
              />
              <label htmlFor={`beat-type-${beatType}`} title={beatType}>
                {beatType}
              </label>
            </React.Fragment>
          ))}
        </div>
          <h3>Beats in bar</h3>
          <input 
            type="number" 
            name="beats-in-bar-input" 
            className="beats-in-bar-input"
            min={1}
            max={20}
            value={tempBeatsInBar}
            onChange={e => setTempBeatsInBar(e.target.value)}
          />
        </section>
        <section className="buttons-section">
          <button className="cancel" type="reset" onClick={cancel}>CANCEL</button>
          <button className="submit" type="submit" onClick={save}>SAVE</button>
        </section>
      </div>
    </ModalWrapper>
  )
}