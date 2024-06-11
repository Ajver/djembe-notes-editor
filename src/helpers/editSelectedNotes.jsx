import { setBeatType, setNote } from "../Redux/rhythmSlice"
import { getLocationFromNoteNumber } from "./noteNumber"
import { playNote } from "./playing/playing"


function forEachSelectedNote(selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, definition, callback) {
  if (selectionStartInstrument < 0) {
    // Nothing selected
    return
  }
  for (let instrumentIdx = selectionStartInstrument; instrumentIdx <= selectionEndInstrument; instrumentIdx++) {
    for (let noteNumber = selectionStartIdx; noteNumber <= selectionEndIdx; noteNumber++) {
      const noteLocation = getLocationFromNoteNumber(noteNumber, instrumentIdx)
      const noteExists = (
        noteLocation.noteIdx < definition[instrumentIdx][noteLocation.beatIdx].notes.length
      )
      if (noteExists) {
        callback(noteLocation)
      }
    }
  }
}

export function setBeatTypeForSelected(selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, definition, dispatch, beatType) {
  forEachSelectedNote(selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, definition, (noteLocation) => {
    const {
      instrumentIdx,
      beatIdx,
    } = noteLocation

    // TODO: Optimize by updating beat type only once!
    
    dispatch(setBeatType({
      instrumentIdx,
      beatIdx,
      newType: beatType,
    }))
  })
}

export function setNoteForSelected(selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, definition, dispatch, noteSymbol) {
  let anythingChanged = false

  forEachSelectedNote(selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, definition, (noteLocation) => {
    dispatch(setNote({ noteLocation, noteSymbol }))
    anythingChanged = true
  })

  if (anythingChanged) {
    playNote(noteSymbol)
  }
}
