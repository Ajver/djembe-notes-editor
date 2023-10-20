
export function getIdxsFromNoteNumber(noteNumber, beatsCount) {
  // TODO: Make it smarter...
  const instrumentIdx = Math.floor(noteNumber / (beatsCount * 10))
  const beatIdx = Math.floor((noteNumber % (beatsCount * 10)) / 10)
  const noteIdx = noteNumber % 10

  return {
    instrumentIdx,
    beatIdx,
    noteIdx,
  }    
}