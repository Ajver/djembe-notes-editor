import { createSlice } from "@reduxjs/toolkit";


export const playerSlice = createSlice({
  name: "player",
  initialState: {
    isPlaying: false,
    currentBarIdx: -1,
  },
  reducers: {
    play: state => {
      state.isPlaying = true
    },
    stop: state => {
      state.isPlaying = false
      state.currentBarIdx = -1
    },
    togglePlaying: state => {
      if (state.isPlaying) {
        playerSlice.caseReducers.stop(state)
      }else {
        playerSlice.caseReducers.play(state)
      }
    },
    setCurrentBarIdx: (state, action) => {
      state.currentBarIdx = action.payload
    }
  }
})

export const {
  play,
  stop,
  togglePlaying,
  setCurrentBarIdx,
} = playerSlice.actions

export default playerSlice.reducer
