

export function calculateNoteNumber(beatIdx, noteIdx) {
  // beatIdx is the index of the beat in the instrument
  // noteIdx is the index of the note in the beat (should be within range 0-3)
  
  // Calculate note number, giving it unique number in this very instrument
  // Used in range selection
  const noteNumberInInstrument = beatIdx * 4 + noteIdx
  return noteNumberInInstrument
}

export function getLocationFromNoteNumber(noteNumberInInstrument, instrumentIdx=undefined) {
  // Reverse process to calculateNoteNumber

  const beatIdx = Math.floor(noteNumberInInstrument / 4)
  const noteIdx = noteNumberInInstrument % 4
  const location = {
    beatIdx,
    noteIdx,
    instrumentIdx,
  }
  return location
}
