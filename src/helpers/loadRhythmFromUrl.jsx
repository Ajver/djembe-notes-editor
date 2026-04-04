import { base64DecodeAndUncompress } from "./textCompressionBase64"
import loadRhythmFromTxt from "./loadRhythmFromTxt"

export function hasRhythmInUrl() {
  const url = new URL(window.location)
  return url.searchParams.has("r")
}

export function loadRhythmFromUrl(dispatch) {
  const url = new URL(window.location)
  const rhythmEnc = url.searchParams.get("r")
  const rhythmTxt = base64DecodeAndUncompress(rhythmEnc)
  console.log(rhythmTxt)
  loadRhythmFromTxt(rhythmTxt, dispatch)
}

export function clearRhythmFromUrl() {
  const url = new URL(window.location)
  url.searchParams.delete("r")
  window.history.pushState({}, '', url);
}
