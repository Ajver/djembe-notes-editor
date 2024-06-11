import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExportModalVisibility } from "../../Redux/modalsSlice";
import { BeatType, NotesCount } from "../../constants/BeatDef";
import { TIPS_PANEL_VISIBLE_KEY } from "../../constants/LocalStorage";
import { copySelectedBeats, pasteBeatsFromClipboard } from "../../helpers/copyPasteRhythm";
import { setBeatTypeForSelected, setNoteForSelected } from "../../helpers/editSelectedNotes";
import { getLocationFromNoteNumber } from "../../helpers/noteNumber";
import { rhythmEditRedo, rhythmEditUndo } from "../../helpers/undoRedo";
import useLocalStorage from "../../hooks/useLocalStorage";
import PlayContainer from "./PlayContainer";
import PrintingSystem from "./PrintingSystem";
import TipsPanel from "./TipsPanel";
import "./css/BottomPanel.css";
import { NoteSymbol } from "../../constants/NoteDef";

export default function BottomPanel() {
  const dispatch = useDispatch()  
  const [tipsVisible, setTipsVisible] = useLocalStorage(TIPS_PANEL_VISIBLE_KEY, true)

  const definition = useSelector(store => store.rhythm.definition)
  const selectionStartIdx = useSelector(store => store.editor.selectionStartIdx)
  const selectionEndIdx = useSelector(store => store.editor.selectionEndIdx)
  const selectionStartInstrument = useSelector(store => store.editor.selectionStartInstrument)
  const selectionEndInstrument = useSelector(store => store.editor.selectionEndInstrument)
  const past = useSelector(store => store.editor.past)
  const present = useSelector(store => store.editor.present)
  const future = useSelector(store => store.editor.future)
  const clipboardContent = useSelector(store => store.editor.copyClipboard)
  
  let nothingSelected = true
  let beatTypeCount = 0

  if (selectionStartIdx >= 0 && selectionStartInstrument >= 0) {
    const noteLocation = getLocationFromNoteNumber(selectionStartIdx)
    const firstBeat = definition[selectionStartInstrument][noteLocation.beatIdx]

    if (firstBeat) {
      const firstBeatType = firstBeat.type
      beatTypeCount = NotesCount[firstBeatType]

      nothingSelected = false
    }
  }
  
  function decreaseBeatType() {
    if (beatTypeCount <= 1) {
      return
    }

    const newBeatType = Object.values(BeatType)[beatTypeCount - 2]
    setBeatTypeForSelected(selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, definition, dispatch, newBeatType)
  }

  function increaseBeatType() {
    if (beatTypeCount >= 4) {
      return
    }
    
    const newBeatType = Object.values(BeatType)[beatTypeCount]
    setBeatTypeForSelected(selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, definition, dispatch, newBeatType)
  }

  function setNote(newNoteType) {
    setNoteForSelected(selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, definition, dispatch, newNoteType)
  }

  function toggleTipsPanel() {
    setTipsVisible(!tipsVisible)
  }

  function showExportModal() {
    dispatch(setExportModalVisibility(true))
  }

  function handleUndo() {
    rhythmEditUndo(past, present, future, dispatch)
  }

  function handleRedo() {
    rhythmEditRedo(past, present, future, dispatch)
  }

  function handleCopy() {
    copySelectedBeats(definition, selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, dispatch)
  }

  function handlePaste() {
    pasteBeatsFromClipboard(clipboardContent, selectionStartIdx, selectionStartInstrument, dispatch)
  }

  const controlPanelDisabledClass = nothingSelected ? "disabled" : ""

  return (
    <>
      <TipsPanel visible={tipsVisible} toggleVisibility={toggleTipsPanel} />
      <section className={"control-panel " + controlPanelDisabledClass}>
        <section className="beat-type-change">
          <button className="icon-btn" onClick={decreaseBeatType}>
            <img src="/assets/svg/ui/arrow-right.svg" alt="Decrease notes in beat" className="flip-h" />
          </button>
          <div className="beat-type-counter">
            {beatTypeCount}
          </div>
          <button className="icon-btn" onClick={increaseBeatType}>
            <img src="/assets/svg/ui/arrow-right.svg" alt="Increase notes in beat" />
          </button>
        </section>
        <section className="note-symbol-change">
          <button className="icon-btn" onClick={() => setNote(NoteSymbol.EMPTY)}>
            <img src="/assets/svg/dash.svg" alt="empty" />
          </button>
          <button className="icon-btn" onClick={() => setNote(NoteSymbol.BASS)}>
            <img src="/assets/svg/bass.svg" alt="bass" />
          </button>
          <button className="icon-btn" onClick={() => setNote(NoteSymbol.TONE)}>
            <img src="/assets/svg/tone.svg" alt="tone" />
          </button>
          <button className="icon-btn" onClick={() => setNote(NoteSymbol.SLAP)}>
            <img src="/assets/svg/cross.svg" alt="slap" />
          </button>
          <button className="icon-btn" onClick={() => setNote(NoteSymbol.GHOST)}>
            <img src="/assets/svg/ghost.svg" alt="ghost" />
          </button>
        </section>
      </section>
      <section className="bottom-panel">
        <section>
          <button className="icon-btn" onClick={toggleTipsPanel}>
            <img src="/assets/svg/ui/help.svg" alt="Show or hide tips panel" />
          </button>
        </section>
        <section className="undo-redo-section">
          <button className="icon-btn" title="undo" onClick={handleUndo}>
            <img src="/assets/svg/ui/undo.svg" alt="undo" />
          </button>
          <button className="icon-btn" title="redo" onClick={handleRedo}>
            <img src="/assets/svg/ui/undo.svg" alt="redo" className="flip-h" />
          </button>
        </section>
        <PlayContainer />
        <section className="exporting-section">
          <button className="icon-btn" onClick={showExportModal}>
            <img src="/assets/svg/ui/download.svg" alt="Download rhythm definition" />
          </button>
          <PrintingSystem />
        </section>
        <section className="copy-paste-section">
          <button className="icon-btn" title="copy" onClick={handleCopy}>
            <img src="/assets/svg/ui/copy.svg" alt="copy" />
          </button>
          <button className="icon-btn" title="paste" onClick={handlePaste}>
            <img src="/assets/svg/ui/paste.svg" alt="paste" />
          </button>
        </section>
      </section>
    </>
  )
}
