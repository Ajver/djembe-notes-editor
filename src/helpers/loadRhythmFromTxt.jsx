import { overrideWholeRhythm } from "../Redux/rhythmSlice"
import { BeatType, NotesCount } from "../constants/BeatDef"

/**
 * 
 * @returns bool - true if loaded successfuly, false otherwise
 */
export default function loadRhythmFromTxt(text, dispatch) {
  const rhythmObj = JSON.parse(text)

  switch(rhythmObj.version) {
    case "1": return load_v1(rhythmObj, dispatch)
    case "2": return load_v2(rhythmObj, dispatch)
    default:
      console.error("Unknown save version: ", rhythmObj.version)
  }

  return true
}

function load_v1(loadedRhythm, dispatch) {
  dispatch(overrideWholeRhythm(loadedRhythm))
  return true
}

function load_v2(loadedRhythm, dispatch) {
  const shortDefinition = loadedRhythm.definition || [""]
  const definition = Array(shortDefinition.length)

  shortDefinition.forEach((shortInstrument, instrumentIdx) => {
    definition[instrumentIdx] = decodeInstrument(shortInstrument)
  })

  const rhythmToOverride = {
    // Set all meta such as title, tempo, etc. - "as is"
    ...loadedRhythm,

    // Override short definition by regular definition
    definition: definition,
  }

  dispatch(overrideWholeRhythm(rhythmToOverride))

  return true
}

export function decodeInstrument(shortInstrument) {
  const instrument = []

  let currentBeatDef = null

  for (let i = 0; i < shortInstrument.length; i++) {
    const char = shortInstrument[i]

    if (currentBeatDef == null || currentBeatDef.notes.length >= NotesCount[currentBeatDef.type]) {
      // We need a new beat
      currentBeatDef = {
        notes: [],
        type: BeatType.SINGLE,
      }

      instrument.push(currentBeatDef)
    }

    switch (char) {
      case "2":
        currentBeatDef.type = BeatType.DOUBLE
        break
      case "3":
        currentBeatDef.type = BeatType.TRIPLET
        break
      case "4":
        currentBeatDef.type = BeatType.QUARTET
        break
      case "-":
      case "B":
      case "T":
      case "S":
      case "G":
        currentBeatDef.notes.push(char)
        break
      default:
        console.error("unknown save symbol: ", char)
    }
  }

  return instrument
}
