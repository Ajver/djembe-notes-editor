import { createSlice } from "@reduxjs/toolkit";

const MAX_TEMPO = 1000
const MIN_TEMPO = 10

export const rhythmSlice = createSlice({
  name: "rhythm",
  initialState: {
    definition: [[]],
    beatsInBar: 4,
    beatsCount: 0,
    tempo: 120,
    title: "Rhythm title",
  },
  reducers: {
    addBar: state => {
      state.definition.forEach(instrument => {
        for (let i = 0; i < state.beatsInBar; i++) {
          const beat = {
            type: "single",
            notes: ["-"],
          }
          instrument.push(beat)
        }
      })
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

export const { addBar, setRhytmTempo, setRhythmTitle } = rhythmSlice.actions 

export default rhythmSlice.reducer
