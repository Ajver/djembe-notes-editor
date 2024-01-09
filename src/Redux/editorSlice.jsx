import { createSlice } from "@reduxjs/toolkit";
import { decodeInstrument } from "../helpers/loadRhythmFromTxt"

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    // Where selection started from?
    _selectionBeginIdx: 0,
    selectionStartIdx: -1,
    selectionEndIdx: -1,
    
    copyClipboard: [],
  },
  reducers: {
    singleSelect: (state, action) => {
      const idx = action.payload
      state._selectionBeginIdx = idx
      state.selectionStartIdx = idx
      state.selectionEndIdx = idx
    },
    addToSelection: (state, action) => {
      const idx = action.payload

      if (idx < state._selectionBeginIdx) {
        state.selectionStartIdx = idx
        state.selectionEndIdx = state._selectionBeginIdx
      }else {
        state.selectionStartIdx = state._selectionBeginIdx
        state.selectionEndIdx = idx
      }
    },
    rangeSelect: (state, action) => {
      const { selectionStartIdx, selectionEndIdx } = action.payload
      state.selectionStartIdx = selectionStartIdx
      state.selectionEndIdx = selectionEndIdx
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
    selectAll: (state, action) => {
      const totalNotesCount = action.payload
      state._selectionBeginIdx = 0
      state.selectionStartIdx = 0
      state.selectionEndIdx = totalNotesCount
    },
    deselectAll: state => {
      state._selectionBeginIdx = 0
      state.selectionStartIdx = -1
      state.selectionEndIdx = -1
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
    setCopyClipboard: (state, action) => {
      state.copyClipboard = action.payload
    },
    pasteFromClipboard: (state, action) => {
      if (state.selectionStartIdx < 0) {
        // Nothing is selected - let's select the first note
        state._selectionBeginIdx = 0
        state.selectionStartIdx = 0
      }

      const { notesOrder } = action.payload

      const decoded = decodeInstrument(state.copyClipboard)

      let i = 0
      while (decoded.length > 0) {
        const beat = decoded.shift()

        beat.notes.forEach(note => {
          // Offset the idx by where selection starts
          const idx = i + state.selectionStartIdx
  
          const noteLocation = notesOrder[idx]
          const {
            instrumentIdx,
            beatIdx,
            noteIdx,
          } = noteLocation
  
          i++
        })
      }
    }
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
  extendSelectionLeft,
  extendSelectionRight,
  setCopyClipboard,
} = editorSlice.actions 

export default editorSlice.reducer
