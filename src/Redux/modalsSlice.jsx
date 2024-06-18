import { createSlice } from "@reduxjs/toolkit"

function isAnyPopupOpened(state) {
  return (
    state.exportModalVisible 
    || state.createRhythmModalVisible
    || state.rhythmSettingsModalVisible
  )
}

export const modalsSlice = createSlice({
  name: "modals",
  initialState: {
    anyPopupOpened: false,
    exportModalVisible: false,
    createRhythmModalVisible: false,
    rhythmSettingsModalVisible: false,
  },
  reducers: {
    setExportModalVisibility: (state, action) => {
      state.exportModalVisible = action.payload
      state.anyPopupOpened = isAnyPopupOpened(state)
    },
    setCreateRhythmModalVisibility: (state, action) => {
      state.createRhythmModalVisible = action.payload
      state.anyPopupOpened = isAnyPopupOpened(state)
    },
    setRhythmSettingsModalVisibility: (state, action) => {
      state.rhythmSettingsModalVisible = action.payload
      state.anyPopupOpened = isAnyPopupOpened(state)
    }
  },
})

export const { 
  setExportModalVisibility,
  setCreateRhythmModalVisibility,
  setRhythmSettingsModalVisibility,
} = modalsSlice.actions 

export default modalsSlice.reducer
