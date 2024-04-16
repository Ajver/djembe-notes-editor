import { createSlice } from "@reduxjs/toolkit";
import { decodeInstrument } from "../helpers/loadRhythmFromTxt"

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    // Where selection started from?
    _selectionBeginIdx: 0,
    _selectionBeginInstrument: 0,
    
    selectionStartIdx: -1,
    selectionStartInstrument: -1,

    selectionEndIdx: -1,
    selectionEndInstrument: -1,

    copyClipboard: [],
  },
  reducers: {
    singleSelect: (state, action) => {
      const { idx, instrument } = action.payload
      state._selectionBeginIdx = idx
      state._selectionBeginInstrument = instrument
      state.selectionStartIdx = idx
      state.selectionStartInstrument = instrument
      state.selectionEndIdx = idx
      state.selectionEndInstrument = instrument
    },
    addToSelection: (state, action) => {
      const { idx, instrument } = action.payload

      if (idx < state._selectionBeginIdx) {
        state.selectionStartIdx = idx
        state.selectionEndIdx = state._selectionBeginIdx
      }else {
        state.selectionStartIdx = state._selectionBeginIdx
        state.selectionEndIdx = idx
      }

      if (instrument < state._selectionBeginInstrument) {
        state.selectionStartInstrument = instrument
        state.selectionEndInstrument = state._selectionBeginInstrument
      }else {
        state.selectionStartInstrument = state._selectionBeginInstrument
        state.selectionEndInstrument = instrument
      }
    },
    rangeSelect: (state, action) => {
      const { 
        selectionStartIdx, 
        selectionStartInstrument,
        selectionEndIdx,
        selectionEndInstrument,
      } = action.payload

      state.selectionStartIdx = selectionStartIdx
      state.selectionStartInstrument = selectionStartInstrument
      state.selectionEndIdx = selectionEndIdx
      state.selectionEndInstrument = selectionEndInstrument
    },
    extendSelectionLeft: state => {
      if (
        state._selectionBeginIdx == state.selectionStartIdx 
        && state.selectionEndIdx != state.selectionStartIdx
      ) {
        // We are selecting Left -> Right, so let's shrink the selection
        state.selectionEndIdx--
      }else {
        // We are selecting Right -> Left, so let's expand the selection to the left
        if (state.selectionStartIdx > 0) {
          // There is some space to expand the selection
          state.selectionStartIdx--
        }
      }
    },
    extendSelectionRight: (state, action) => {
      const totalNotesCount = action.payload

      if (state._selectionBeginIdx == state.selectionStartIdx) {
        // We are selecting Left -> Right, so let's expand the selection
        if (state.selectionEndIdx < totalNotesCount - 1) {
          // There is some space to expand the selection
          state.selectionEndIdx++
        }
      }else {
        // We are selecting Right -> Left, so let's shrink the selection to the right
        if (state.selectionStartIdx < state.selectionEndIdx) {
          // More than one note is selected, so let's shrink it
          state.selectionStartIdx++
        }
      }
    },
    extendSelectionUp: state => {
      if (
        state._selectionBeginInstrument == state.selectionStartInstrument
        && state.selectionEndInstrument != state.selectionStartInstrument
      ) {
        // We are selecting Up -> Down, so let's shrink the selection
        state.selectionEndInstrument--
      }else {
        // We are selecting Down -> Up, so let's expand the selection to the upper instruments
        if (state.selectionStartInstrument > 0) {
          // There is some space to expand the selection
          state.selectionStartInstrument--
        }
      }
    },
    extendSelectionDown: (state, action) => {
      const totalInstrumentsCount = action.payload

      if (state._selectionBeginInstrument == state.selectionStartInstrument) {
        // We are selecting Up -> Down, so let's expand the selection
        if (state.selectionEndInstrument < totalInstrumentsCount - 1) {
          // There is some space to expand the selection
          state.selectionEndInstrument++
        }
      }else {
        // We are selecting Down -> Up, so let's shrink the selection to lower instruments
        if (state.selectionStartInstrument < state.selectionEndInstrument) {
          // More than one instrument is selected, so let's shrink it
          state.selectionStartInstrument++
        }
      }
    },
    selectAll: (state, action) => {
      const { totalNotesCount, totalInstrumentsCount } = action.payload
      state._selectionBeginIdx = 0
      state._selectionBeginInstrument = 0
      state.selectionStartIdx = 0
      state.selectionStartInstrument = 0
      state.selectionEndIdx = totalNotesCount - 1
      state.selectionEndInstrument = totalInstrumentsCount - 1
    },
    deselectAll: state => {
      state._selectionBeginIdx = 0
      state._selectionBeginInstrument = 0
      state.selectionStartIdx = -1
      state.selectionStartInstrument = -1
      state.selectionEndIdx = -1
      state.selectionEndInstrument = -1
    },
    moveSelectionLeft: state => {
      if (state.selectionStartIdx <= 0) {
        return
      }

      state._selectionBeginIdx--
      state.selectionStartIdx--
      state.selectionEndIdx--
    },
    moveSelectionRight: (state, action) => {
      const totalNotesCount = action.payload
      if (state.selectionEndIdx >= totalNotesCount - 1) {
        return
      }
      
      state._selectionBeginIdx++
      state.selectionStartIdx++
      state.selectionEndIdx++
    },
    moveSelectionUp: state => {
      if (state.selectionStartInstrument <= 0) {
        return
      }

      state._selectionBeginInstrument--
      state.selectionStartInstrument--
      state.selectionEndInstrument--
    },
    moveSelectionDown: (state, action) => {
      const totalInstrumentsCount = action.payload
      if (state.selectionEndInstrument >= totalInstrumentsCount - 1) {
        return
      }
      
      state._selectionBeginInstrument++
      state.selectionStartInstrument++
      state.selectionEndInstrument++
    },
    setCopyClipboard: (state, action) => {
      state.copyClipboard = action.payload
    },
  }
})

export const { 
  addToSelection, 
  rangeSelect,
  singleSelect,
  selectAll,
  deselectAll,
  moveSelectionLeft,
  moveSelectionRight,
  moveSelectionUp,
  moveSelectionDown,
  extendSelectionLeft,
  extendSelectionRight,
  extendSelectionUp,
  extendSelectionDown,
  setCopyClipboard,
} = editorSlice.actions 

export default editorSlice.reducer
