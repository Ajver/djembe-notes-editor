import { setInternalClipboardContent } from "../Redux/editorSlice"
import { pasteRhythmFragment } from "../Redux/rhythmSlice"
import { shortenInstrument } from "./saveRhythmToTxt"


export function copySelectedBeats(definition, selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, dispatch) {
  if (selectionStartIdx < 0 || selectionStartInstrument < 0) {
    // Nothing selected - nothing to copy
    return
  }

  const instrumentsToCopyList = []

  const firstBeatToCopyIdx = Math.floor(selectionStartIdx / 4)
  const lastBeatToCopyIdx = Math.floor(selectionEndIdx / 4)

  for (let instrumentIdx = selectionStartInstrument; instrumentIdx <= selectionEndInstrument; instrumentIdx++) {
    const instrumentToCopy = definition[instrumentIdx].slice(firstBeatToCopyIdx, lastBeatToCopyIdx + 1)
    const shortInstrumentDef = shortenInstrument(instrumentToCopy)
    instrumentsToCopyList.push(shortInstrumentDef)
  }
  const strInstrumentsToCopy = instrumentsToCopyList.join("\n")

  const textArea = document.createElement('textarea');
  textArea.value = strInstrumentsToCopy;
  
  // Make sure the text area is not visible on the page
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  
  // Copy to internal clipboard (in case we don't have permission to use native one)
  dispatch(setInternalClipboardContent(strInstrumentsToCopy))
}

export function pasteBeatsFromClipboard(internalClipboardContent, startNoteIdx, startInstrument, dispatch) {
  if (startNoteIdx < 0 || startInstrument < 0) {
    // Nothing selected - we can't paste when we don't know where to paste
    return
  }

  const rhythmFragmentDef = internalClipboardContent
  const pasteStartIdx = Math.floor(startNoteIdx / 4)
  const pasteStartInstrument = startInstrument
  dispatch(pasteRhythmFragment({ rhythmFragmentDef, pasteStartIdx, pasteStartInstrument }))
}