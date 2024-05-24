import { createSlice } from "@reduxjs/toolkit";


export const playerSlice = createSlice({
  name: "player",
  initialState: {
    isPlaying: false,
    repeat: false,
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
    toggleRepeat: state => {
      state.repeat = !state.repeat
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
  toggleRepeat,
  setCurrentBarIdx,
} = playerSlice.actions

export default playerSlice.reducer
