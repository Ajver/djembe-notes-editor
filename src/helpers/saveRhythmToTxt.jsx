import { NotesCount } from "../constants/BeatDef"

const SAVE_VERSION = "2"

export default function saveRhythmToTxt(rhythm) {
  const definition = shortenRhythmDefinition(rhythm.definition)

  const toSaveObj = {
    // All rhythm meta, such as name, tempo, etc.
    ...rhythm,
    
    // Override definition to short version (i.e. "2BTTS3G..")
    definition: definition,

    version: SAVE_VERSION,
  }

  const rhythmTxt = JSON.stringify(toSaveObj)
  return rhythmTxt
}

export function shortenRhythmDefinition(definition) {
  const shortDef = Array(definition.length)

  definition.forEach((instrument, instrumentIdx) => {
    shortDef[instrumentIdx] = shortenInstrument(instrument)
  })

  return shortDef
}

export function shortenInstrument(instrument) {
  let shortInst = ""

  instrument.forEach(beatDef => {
    const notesCount = NotesCount[beatDef.type]
    const beatTypeSymbol = notesCount > 1 ? notesCount.toString() : ""   
    shortInst += beatTypeSymbol

    beatDef.notes.forEach(noteSymbol => {
      shortInst += noteSymbol
    })
  })

  return shortInst
}
