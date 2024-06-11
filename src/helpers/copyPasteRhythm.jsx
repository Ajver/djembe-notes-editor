import { setInternalClipboardContent } from "../Redux/editorSlice"
import { pasteRhythmFragment } from "../Redux/rhythmSlice"
import { shortenInstrument } from "./saveRhythmToTxt"


export function copySelectedBeats(definition, selectionStartIdx, selectionEndIdx, selectionStartInstrument, selectionEndInstrument, dispatch) {
  console.log("Copy HELPER")

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

  // Copy to native clipboard
  document.body.appendChild(textArea);
  textArea.select();
  window.setTimeout(() => textArea.remove(), 10)
}

export function pasteBeatsFromClipboard(internalClipboardContent, startNoteIdx, startInstrument, dispatch) {
  if (startNoteIdx < 0 || startInstrument < 0) {
    // Nothing selected - we can't paste when we don't know where to paste
    return
  }

  const pasteStartIdx = Math.floor(startNoteIdx / 4)
  const pasteStartInstrument = startInstrument

  navigator.clipboard.readText().then(clipText => {
    console.log("Pasting from native clipboard: ", clipText)
    const rhythmFragmentDef = clipText
    dispatch(pasteRhythmFragment({ rhythmFragmentDef, pasteStartIdx, pasteStartInstrument }))
  }).catch(() => {
    console.log("Pasting from internal:", internalClipboardContent)
    // Looks like we don't have permisions to use clipboard. Let's use internal clipboard instead!
    const rhythmFragmentDef = internalClipboardContent
    dispatch(pasteRhythmFragment({ rhythmFragmentDef, pasteStartIdx, pasteStartInstrument }))
  })
}