import { createSlice } from "@reduxjs/toolkit";

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    // Where selection started from?
    _selectionBeginIdx: -1,
    selectionStartIdx: -1,
    selectionEndIdx: -1,

    canAutosave: false,
    canUndoRedo: false,
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
    deselectAll: state => {
      state.selectionStartIdx = -1
      state.selectionEndIdx = -1
    },
    moveSelectionLeft: state => {
      if (state.selectionStartIdx <= 0) {
        return
      }

      state.selectionStartIdx--
      state.selectionEndIdx--
    },
    moveSelectionRight: (state, action) => {
      const totalNotesCount = action.payload
      if (state.selectionEndIdx >= totalNotesCount - 1) {
        return
      }
      
      state.selectionStartIdx++
      state.selectionEndIdx++
    },
  }
})

export const { 
  addToSelection, 
  rangeSelect,
  singleSelect,
  deselectAll,
  moveSelectionLeft,
  moveSelectionRight,
} = editorSlice.actions 

export default editorSlice.reducer
