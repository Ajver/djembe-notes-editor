import { createSlice } from "@reduxjs/toolkit"

function isAnyPopupOpened(state) {
  return (
    state.exportModalVisible 
    || state.createRhythmModalVisible
  )
}

export const modalsSlice = createSlice({
  name: "modals",
  initialState: {
    anyPopupOpened: false,
    exportModalVisible: false,
    createRhythmModalVisible: false,
  },
  reducers: {
    setExportModalVisibility: (state, action) => {
      state.exportModalVisible = action.payload
      state.anyPopupOpened = isAnyPopupOpened(state)
    },
    setCreateRhythmModalVisibility: (state, action) => {
      state.createRhythmModalVisible = action.payload
      state.anyPopupOpened = isAnyPopupOpened(state)
    }
  },
})

export const { 
  setExportModalVisibility,
  setCreateRhythmModalVisibility,
} = modalsSlice.actions 

export default modalsSlice.reducer
