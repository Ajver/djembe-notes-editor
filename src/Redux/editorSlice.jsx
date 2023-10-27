import { createSlice } from "@reduxjs/toolkit";

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    // startIdx: -1,
    // endIdx: -1,
    selectedIds: [],
    canAutosave: false,
  },
  reducers: {
    select: (state, action) => {
      const idx = action.payload
      if (!state.selectedIds.includes(idx)) {
        state.selectedIds.push(idx)
      }
    },
    singleSelect: (state, action) => {
      const idx = action.payload
      state.selectedIds = [idx]
    },
    deselectAll: state => {
      state.selectedIds = []
    },
    setCanAutosave: (state, action) => {
      state.canAutosave = action.payload
    },
    // TODO: implement as a range selection
    // addToSelection: (state, action) => {
    //   const idx = action.payload
    //   state.startIdx = Math.min(state.startIdx, idx)
    //   state.endIdx = Math.max(state.endIdx, idx)
    // },
    // rangeSelect: (state, action) => {
    //   const { startIdx, endIdx } = action.payload
    //   state.startIdx = startIdx
    //   state.endIdx = endIdx
    // },
    // singleSelect: (state, action) => {
    //   const idx = action.payload
    //   state.startIdx = idx
    //   state.endIdx = idx
    // },
    // deselectAll: state => {
    //   state.startIdx = -1
    //   state.endIdx = -1
    // }
    // TODO: Move selection left/right
  }
})

export const { 
  select, 
  singleSelect,
  deselectAll,
  setCanAutosave,
} = editorSlice.actions 

export default editorSlice.reducer
