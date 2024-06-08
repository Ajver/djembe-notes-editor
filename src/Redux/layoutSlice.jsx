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
      
      const layout = buildLayout(rhythm, containerWidth, toDesktop)
      state.layout = layout
    }
  }
})

export const { 
  generateLayout,
} = layoutSlice.actions 

export default layoutSlice.reducer
