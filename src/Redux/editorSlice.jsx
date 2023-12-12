import { createSlice } from "@reduxjs/toolkit";

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    startIdx: -1,
    endIdx: -1,
    canAutosave: false,
  },
  reducers: {
    singleSelect: (state, action) => {
      const idx = action.payload
      state.startIdx = idx
      state.endIdx = idx
    },
    setCanAutosave: (state, action) => {
      state.canAutosave = action.payload
    },
    addToSelection: (state, action) => {
      const idx = action.payload
      state.startIdx = Math.min(state.startIdx, idx)
      state.endIdx = Math.max(state.endIdx, idx)
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
  setCanAutosave,
} = editorSlice.actions 

export default editorSlice.reducer
