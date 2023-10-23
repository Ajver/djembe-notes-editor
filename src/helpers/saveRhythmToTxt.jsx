
const SAVE_VERSION = "1"

export default function saveRhythmToTxt(rhythm) {
  const toSaveObj = {
    ...rhythm,
    version: SAVE_VERSION,
  }
  const rhythmTxt = JSON.stringify(toSaveObj)
  return rhythmTxt
}