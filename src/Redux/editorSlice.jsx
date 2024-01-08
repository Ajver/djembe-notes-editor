import { createSlice } from "@reduxjs/toolkit";

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    // Where selection started from?
    _selectionBeginIdx: -1,
    startIdx: -1,
    endIdx: -1,

    canAutosave: false,
    canUndoRedo: false,
  },
  reducers: {
    singleSelect: (state, action) => {
      const idx = action.payload
      state._selectionBeginIdx = idx
      state.startIdx = idx
      state.endIdx = idx
    },
    addToSelection: (state, action) => {
      const idx = action.payload

      if (idx < state._selectionBeginIdx) {
        state.startIdx = idx
        state.endIdx = state._selectionBeginIdx
      }else {
        state.startIdx = state._selectionBeginIdx
        state.endIdx = idx
      }
    },
    rangeSelect: (state, action) => {
      const { startIdx, endIdx } = action.payload
      state.startIdx = startIdx
      state.endIdx = endIdx
    },
    deselectAll: state => {
      state.startIdx = -1
      state.endIdx = -1
    }
    // TODO: Move selection left/right
  }
})

export const { 
  addToSelection, 
  rangeSelect,
  singleSelect,
  deselectAll,
} = editorSlice.actions 

export default editorSlice.reducer
