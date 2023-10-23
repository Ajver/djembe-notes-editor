import { createSlice } from "@reduxjs/toolkit"
import { NoteSymbol } from "../constants/NoteDef"
import { BeatType, NotesCount } from "../constants/BeatDef"
import { getIdxsFromNoteNumber } from "../helpers/RhythmElementNumber"
import { RhythmMeterPresets } from "../constants/RhythmMeterPresets"

const MAX_TEMPO = 1000
const MIN_TEMPO = 10

export const rhythmSlice = createSlice({
  name: "rhythm",
  initialState: {
    definition: [[], []],
    beatsInBar: 4,
    beatsCount: 0,
    tempo: 120,
    title: "Rhythm title",
    defaultBeatType: BeatType.DOUBLE,
  },
  reducers: {
    overrideWholeRhythm: (state, action) => {
      console.log("OVERRIDING: ", action.payload)
      Object.keys(state).forEach(key => {
        state[key] = action.payload[key]
      })
    },
    createNewRhythm: (state, action) => {
      const { preset, instrumentsAmount } = action.payload
      const { beatsInBar, defaultBeatType } = RhythmMeterPresets[preset]
      
      state.beatsInBar = beatsInBar
      state.defaultBeatType = defaultBeatType

      state.definition = Array(instrumentsAmount).fill([])
      state.beatsCount = 0
    },
    addBar: state => {
      const expectedNotesCount = NotesCount[state.defaultBeatType]

      state.definition.forEach(instrument => {
        for (let i = 0; i < state.beatsInBar; i++) {
          const beat = {
            type: state.defaultBeatType,
            notes: Array(expectedNotesCount).fill(NoteSymbol.EMPTY),
          }
          instrument.push(beat)
        }
      })
      state.beatsCount += state.beatsInBar
    },
    setNote: (state, action) => {
      const { noteNumber, noteSymbol } = action.payload
      const {
        instrumentIdx,
        beatIdx,
        noteIdx,
      } = getIdxsFromNoteNumber(noteNumber, state.beatsCount)    
  
      const beatDef = state.definition[instrumentIdx][beatIdx]
      beatDef.notes[noteIdx] = noteSymbol
    },
    setBeatType: (state, action) => {
      const { instrumentIdx, beatIdx, newType } = action.payload
      const beatDef = state.definition[instrumentIdx][beatIdx]
      
      if (beatDef.type == newType) {
        // It's already of that type
        return
      }
      
      beatDef.type = newType

      const expectedNotesCount = NotesCount[newType]
      
      // Add missing notes
      while(beatDef.notes.length < expectedNotesCount) {
          const note = "-"
          beatDef.notes.push(note)
      }

      // Remove extra noteBtns
      if(beatDef.notes.length > expectedNotesCount) {
        beatDef.notes.splice(expectedNotesCount)
      }
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

export const { 
  overrideWholeRhythm,
  createNewRhythm,
  addBar, 
  setNote,
  setBeatType, 
  setRhytmTempo, 
  setRhythmTitle,
} = rhythmSlice.actions 

export default rhythmSlice.reducer
