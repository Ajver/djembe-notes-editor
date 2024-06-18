import { createSlice } from "@reduxjs/toolkit"
import buildLayout from "../helpers/buildLayout";


export const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    layout: [],
  },
  reducers: {
    generateLayout: (state, action) => {
      const {
        rhythm,
        containerWidth,
        toDesktop,
      } = action.payload

      state.layout = buildLayout(rhythm, containerWidth, toDesktop)
    }
  }
})

export const {
  generateLayout,
} = layoutSlice.actions

export default layoutSlice.reducer
