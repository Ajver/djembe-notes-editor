import { useDispatch } from "react-redux"
import { RHYTHM_KEY } from "../constants/LocalStorage"
import { overrideWholeRhythm } from "../Redux/rhythmSlice"

/**
 * 
 * @returns bool - true if loaded successfuly, false otherwise
 */
export default function loadRhythmFromLocalStorage() {
  const jsonValue = localStorage.getItem(RHYTHM_KEY)
  
  if (jsonValue == null) {
    console.log("FAILED TO LOAD", jsonValue)
    return false
  }
  
  const rhythmObj = JSON.parse(jsonValue)
  console.log("LOADING", rhythmObj)

  switch(rhythmObj.version) {
    case "1": load_v1(rhythmObj); break
    default:
      console.error("Unknown save version: ", rhythmObj.version)
  }

  return true
}

function load_v1(rhythmObj) {
  const dispatch = useDispatch()
  dispatch(overrideWholeRhythm(rhythmObj))  
}
