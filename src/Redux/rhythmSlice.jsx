import { createSlice } from "@reduxjs/toolkit";

const MAX_TEMPO = 1000
const MIN_TEMPO = 10

export const rhythmSlice = createSlice({
  name: "rhythm",
  initialState: {
    definition: [[]],
    beatsCount: 0,
    tempo: 120,
    title: "Rhythm title",
  },
  reducers: {
    addFullScore: state => {
      const fullScore = [
        ["-"], ["-"], ["-"], ["-"]
      ]
      state.beats.push(...fullScore)
    },
    setRhytmTempo: (state, action) => {
      const newTempo = Math.max(Math.min(action.payload, MAX_TEMPO), MIN_TEMPO)
      state.tempo = newTempo
    },
    setRhythmTitle: (state, action) => {
      state.title = action.payload
    }
  }
})

export const { addFullScore, setRhytmTempo, setRhythmTitle } = rhythmSlice.actions 

export default rhythmSlice.reducer
