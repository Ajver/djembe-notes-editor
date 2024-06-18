import { createSlice } from "@reduxjs/toolkit"
import { NoteSymbol } from "../constants/NoteDef"
import { BeatType, NotesCount } from "../constants/BeatDef"
import { RhythmMeterPresets } from "../constants/RhythmMeterPresets"
import { decodeInstrument } from "../helpers/loadRhythmFromTxt"

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
    defaultBeatType: BeatType.SINGLE,
  },
  reducers: {
    setDefaultBeatType: (state, action) => {
      state.defaultBeatType = action.payload
    },
    setBeatsInBar: (state, action) => {
      state.beatsInBar = parseInt(action.payload)

      const beatsOutsideOfBar = state.beatsCount % state.beatsInBar

      if (beatsOutsideOfBar > 0) {
        const extraNeeded = state.beatsInBar - beatsOutsideOfBar

        rhythmSlice.caseReducers.injectEmptyBeatsToAllInstrumentsAtIdx(state, {payload: {
          beatIdx: state.beatsCount, // At the end
          beatsToInjectCount: extraNeeded,
        }})
      }
    },
    overrideWholeRhythm: (state, action) => {
      Object.keys(state).forEach(key => {
        state[key] = action.payload[key] || rhythmSlice.getInitialState()[key]
      })

      const beatsCount = Math.max(...state.definition.map(instrument => instrument.length))
      state.definition.forEach((instrument, instrumentIdx) => {
        if (instrument.length < beatsCount) {
          instrument.push({
            type: state.defaultBeatType,
            notes: Array(expectedNotesCount).fill(NoteSymbol.EMPTY),
          })
        }

        if (instrument.length > beatsCount) {
          instrument.splice(beatsCount)
        }
      })
    },
    pasteRhythmFragment: (state, action) => {
      const { rhythmFragmentDef, pasteStartIdx, pasteStartInstrument } = action.payload

      const allInstrumentsDef = rhythmFragmentDef.split("\n")

      allInstrumentsDef.forEach((instrumentDef, instrumentOffset) => {
        const decodedInstrument = decodeInstrument(instrumentDef)
        const instrumentIdx = pasteStartInstrument + instrumentOffset

        if (state.definition.length <= instrumentIdx) {
          // Instrument out of bounds
          return
        }

        const instrument = state.definition[instrumentIdx]

        decodedInstrument.forEach((beat, beatOffset) => {
          const beatIdx = pasteStartIdx + beatOffset

          if (instrument.length <= beatIdx) {
            // Beat out of bounds
            return
          }

          // Make sure the beat has the right type (and so the right amount of nodes)
          // ...before we start overriding the notes
          rhythmSlice.caseReducers.setBeatType(state, {payload: {
            instrumentIdx,
            beatIdx,
            newType: beat.type
          }})

          beat.notes.forEach((noteDef, noteIdx) => {
            instrument[beatIdx].notes[noteIdx] = noteDef
          })
        })
      })
    },
    createNewRhythm: (state, action) => {
      const { preset, instrumentsAmount } = action.payload
      const { beatsInBar, defaultBeatType } = RhythmMeterPresets[preset]
      
      state.beatsInBar = beatsInBar
      state.defaultBeatType = defaultBeatType
      
      // Reset rhythm to empty
      state.definition = []
      for (let i = 0; i < instrumentsAmount; i++) {
        state.definition.push([])
      }
      state.beatsCount = 0

      rhythmSlice.caseReducers.addBar(state)
    },
    injectBarAtBeatIdx: (state, action) => {
      rhythmSlice.caseReducers.injectEmptyBeatsToAllInstrumentsAtIdx(state, {payload: {
        beatIdx: action.payload,
        beatsToInjectCount: state.beatsInBar,
      }})
    },
    injectEmptyBeatsToAllInstrumentsAtIdx: (state, action) => {
      const { beatIdx, beatsToInjectCount } = action.payload

      const expectedNotesCount = NotesCount[state.defaultBeatType]

      state.definition.forEach(instrument => {
        const beats = Array(beatsToInjectCount).fill(0).map(_ => {
          return {
            type: state.defaultBeatType,
            notes: Array(expectedNotesCount).fill(NoteSymbol.EMPTY),
          }
        })
        instrument.splice(beatIdx, 0, ...beats)
      })
      state.beatsCount += beatsToInjectCount
    },
    addBar: state => {
      rhythmSlice.caseReducers.injectBarAtBeatIdx(state, {payload: state.beatsCount})
    },
    deleteBar: (state, action) => {
      const beatIdx = action.payload
      
      state.definition.forEach(instrument => {
        instrument.splice(beatIdx, state.beatsInBar)
      })

      state.beatsCount -= state.beatsInBar
    },
    setNote: (state, action) => {
      const { noteLocation, noteSymbol } = action.payload
      const {
        instrumentIdx,
        beatIdx,
        noteIdx,
      } = noteLocation
  
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
      state.title = action.payload.trim()
    }
  }
})

export const { 
  setDefaultBeatType,
  setBeatsInBar,
  overrideWholeRhythm,
  pasteRhythmFragment,
  createNewRhythm,
  injectBarAtBeatIdx,
  addBar, 
  deleteBar,
  setNote,
  setBeatType, 
  setRhytmTempo, 
  setRhythmTitle,
} = rhythmSlice.actions 

export default rhythmSlice.reducer
