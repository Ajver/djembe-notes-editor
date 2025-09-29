import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./css/RhythmSettingsModal.css"
import ModalWrapper from "./ModalWrapper";
import { BeatType } from "../../constants/BeatDef";
import { setRhythmSettingsModalVisibility } from "../../Redux/modalsSlice";
import { setBeatsInBar, setDefaultBeatType } from "../../Redux/rhythmSlice";
import { useDrag, useDrop } from "react-dnd";


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
    <ModalWrapper isVisible={ isVisible }>
      <div className="rhythm-settings-modal modal">
        <h2>Rhythm settings</h2>
        <section className="beat-edit-section">
          <h3>Default beat type</h3>
          <p>(applies to newly created bars)</p>
          <div className="beat-type-selection-container">
            { Object.values(BeatType).map((beatType) => (
              <React.Fragment key={ beatType }>
                <input
                  type="radio"
                  className="choose-beat-type-btn"
                  name="choose-beat-type-btn"
                  id={ `beat-type-${ beatType }` }
                  value={ beatType }
                  onChange={ e => setTempBeatType(e.target.value) }
                  checked={ beatType === tempBeatType }
                />
                <label htmlFor={ `beat-type-${ beatType }` } title={ beatType }>
                  { beatType }
                </label>
              </React.Fragment>
            )) }
          </div>
          <h3>Beats in bar</h3>
          <input
            type="number"
            name="beats-in-bar-input"
            className="beats-in-bar-input"
            min={ 1 }
            max={ 20 }
            value={ tempBeatsInBar }
            onChange={ e => setTempBeatsInBar(e.target.value) }
          />
        </section>
        <RhythmManagementSection/>
        <section className="buttons-section">
          <button className="cancel" type="reset" onClick={ cancel }>CANCEL</button>
          <button className="submit" type="submit" onClick={ save }>SAVE</button>
        </section>
      </div>
    </ModalWrapper>
  )
}

function RhythmManagementSection() {
  const [{isOver}, drop] = useDrop({
    accept: "instrument",
    drop: (item, monitor) => {
      console.log(item)
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  })
  const definition = useSelector(store => store.rhythm.definition)

  const [tempOrder, setTempOrder] = useState([])
  console.log(tempOrder)

  const [instrumentsToDelete, setInstrumentsToDelete] = useState([])
  console.log("To delete: ", instrumentsToDelete)

  useEffect(() => setTempOrder(Array.from({length: definition.length}, (_, i) => i)), [definition])
  
  const instrumentsManagement = {
    moveInstrumentAtPosition: (oldTempIdx, newTempIdx) => {
      if (oldTempIdx == newTempIdx) {
        // We're moving to the same place
        return
      }

      const instrumentIdx = tempOrder[oldTempIdx]

      console.log("Moving instrument ", instrumentIdx, " at pos: ", newTempIdx)

      const newTempOrder = [...tempOrder]

      if (oldTempIdx < newTempIdx) {
        for (let i = oldTempIdx; i < newTempIdx; i++) {
          newTempOrder[i] = tempOrder[i+1]
        }
        newTempOrder[newTempIdx] = instrumentIdx
      }else {
        for (let i = newTempIdx; i < oldTempIdx; i++) {
          newTempOrder[i+1] = tempOrder[i]
        }
        newTempOrder[newTempIdx] = instrumentIdx
      }

      setTempOrder(newTempOrder)
    },
    addNewInstrument: () => {
      console.log("Adding new instrument")
    },
    deleteInstrument: (instrumentIdx) => {
      console.log("Deleting instrument: ", instrumentIdx)
      setInstrumentsToDelete([...instrumentsToDelete, instrumentIdx])
    },
    revertDeletion: (instrumentIdx) => {
      console.log("Reverting deletion of: ", instrumentIdx)
      setInstrumentsToDelete(instrumentsToDelete.filter(idx => idx != instrumentIdx))
    }
  }

  return (
    <section className="rhythm-management-section" style={ {backgroundColor: isOver ? "#777" : "#fff"} } ref={ drop }>
      {
        tempOrder.map((instrumentIdx, tempIdx) => (
          <DraggableInstrumentRow 
            key={ tempIdx } 
            instrumentIdx={ instrumentIdx } 
            tempIdx={ tempIdx }
            toDelete={ instrumentsToDelete.includes(instrumentIdx) }
            instrumentsManagement={ instrumentsManagement }
          />
        ))
      }
    </section>
  )
}

function DraggableInstrumentRow({instrumentIdx, tempIdx, toDelete, instrumentsManagement}) {
  const [{isDragging}, drag] = useDrag({
    type: "instrument",
    item: {
      instrumentIdx: instrumentIdx,
      tempIdx: tempIdx,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "instrument",
    hover: (item, monitor) => {
      console.log(tempIdx, item, monitor)
      instrumentsManagement.moveInstrumentAtPosition(item.tempIdx, tempIdx)
      item.tempIdx = tempIdx
    }
  })

  function onDeleteBtnClicked() {
    if (toDelete) {
      instrumentsManagement.revertDeletion(instrumentIdx)
    }else {
      instrumentsManagement.deleteInstrument(instrumentIdx)
    }
  }
  
  return (
    <div className="drop-wrapper" ref={drop}>
      <div className="draggable-instrument-row" ref={ drag }>
        <button className="icon-btn" title="Delete this instrument" onClick={onDeleteBtnClicked}>
          <img src="assets/svg/ui/trash.svg" alt="Delete"/>
        </button>
        <p style={ {fontWeight: isDragging ? "bold" : "normal"} }>Rhythm { instrumentIdx + 1 }</p>
        <div>%</div>
        { toDelete && <div className="to-delete">Will be deleted</div> }
      </div>
    </div>
  )
}