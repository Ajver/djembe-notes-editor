import { RHYTHM_KEY } from "../constants/LocalStorage"
import loadRhythmFromTxt from "./loadRhythmFromTxt"

/**
 * 
 * @returns bool - true if loaded successfuly, false otherwise
 */
export default function loadRhythmFromLocalStorage(dispatch) {
  const jsonValue = localStorage.getItem(RHYTHM_KEY)
  
  if (jsonValue == null) {
    console.log("FAILED TO LOAD", jsonValue)
    return false
  }
  
  const result = loadRhythmFromTxt(jsonValue, dispatch)
  return result
}
