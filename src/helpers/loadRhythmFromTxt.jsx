import { overrideWholeRhythm } from "../Redux/rhythmSlice"

/**
 * 
 * @returns bool - true if loaded successfuly, false otherwise
 */
export default function loadRhythmFromTxt(text, dispatch) {
  const rhythmObj = JSON.parse(text)
  console.log("LOADING", rhythmObj)

  switch(rhythmObj.version) {
    case "1": load_v1(rhythmObj, dispatch); break
    default:
      console.error("Unknown save version: ", rhythmObj.version)
  }

  return true
}

function load_v1(rhythmObj, dispatch) {
  dispatch(overrideWholeRhythm(rhythmObj))
}
