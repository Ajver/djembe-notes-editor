import { createSlice } from "@reduxjs/toolkit"
import buildLayout from "../helpers/buildLayout";

function _buildNotesOrderList(state, action) {
  const { definition } = action.payload.rhythm

  const notesOrder = []

  state.layout.forEach(sheet => {
    sheet.elements.forEach(element => {
      if (element.type !== "full-score") {
        // Ignore non-full-scores (i.e. headers)
        return
      }

      // Now we know that the element is a Full Score
      const fullScore = element

      for (let instrumentIdx = 0; instrumentIdx < definition.length; instrumentIdx++) {
        // We need to loop through each instrument in this full score
        // to gather correct order of notes

        fullScore.bars.forEach(bar => {
          bar.beats.forEach(beat => {
            const beatIdx = beat.index
            const beatDef = definition[instrumentIdx][beatIdx]
            beat.notesPerInstrument[instrumentIdx] = []

            beatDef.notes.forEach((_symbol, noteIdx) => {
              const noteLocation = {
                instrumentIdx,
                beatIdx,
                noteIdx,
              }
              const thisNotesOrderIdx = notesOrder.length
              notesOrder.push(noteLocation)
              beat.notesPerInstrument[instrumentIdx].push(thisNotesOrderIdx)
            })
          })
        })
      }
    })
  });

  state.notesOrder = notesOrder
}

export const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    layout: [],
    notesOrder: [],
  },
  reducers: {
    buildLayoutAndNotesOrder: (state, action) => {
      const {
        rhythm,
        containerWidth,
        toDesktop,
      } = action.payload
      
      const layout = buildLayout(rhythm, containerWidth, toDesktop)
      state.layout = layout

      _buildNotesOrderList(state, action)
    }
  }
})

export const { 
  buildLayoutAndNotesOrder,
} = layoutSlice.actions 

export default layoutSlice.reducer
