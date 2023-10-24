import loadRhythmFromTxt from "./loadRhythmFromTxt";

/**
 * 
 * @returns bool - true if loaded successfuly, false otherwise
 */
export default function loadRhythmFromFile(file, dispatch) {
  const reader = new FileReader()
  reader.onload = function(event) {
    const jsonValue = event.target.result

    if (jsonValue == null) {
      console.log("FAILED TO LOAD", jsonValue)
      return false
    }

    loadRhythmFromTxt(jsonValue, dispatch)                                                                                                                                     
  }

  reader.readAsText(file)
}