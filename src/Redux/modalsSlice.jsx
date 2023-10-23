import { createSlice } from "@reduxjs/toolkit"

function isAnyPopupOpened(state) {
  return (
    state.exportModalVisible 
    // || other popups...
  )
}

export const modalsSlice = createSlice({
  name: "modals",
  initialState: {
    anyPopupOpened: false,
    exportModalVisible: false,
  },
  reducers: {
    setExportModalVisibility: (state, action) => {
      state.exportModalVisible = action.payload
      state.anyPopupOpened = isAnyPopupOpened(state)
    },
  },
})

export const { 
  setExportModalVisibility, 
} = modalsSlice.actions 

export default modalsSlice.reducer
