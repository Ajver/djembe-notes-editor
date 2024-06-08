
export default function buildLayout(rhythm, containerWidth, toDesktop) {
  const { 
    definition, 
    beatsInBar, 
    beatsCount 
  } = rhythm

  // TODO: Move these sizes to external store (to make it central and editable)
  // and don't need to fix these values after changing CSS (css should pull the values from the same store)
  const TITLE_HEIGHT = 47
  const TEMPO_HEIGHT = 26

  const ONE_FULL_SCORE_HEIGHT = (definition.length - 1) * 70 + 90

  const MAX_SHEET_HEIGHT = 1090
  const FULL_SCORE_MARGIN = toDesktop ? 100 : 40
  const MAX_FULL_SCORE_WIDTH = containerWidth - FULL_SCORE_MARGIN

  // 15px is padding + 2px bar line, no beats included
  const EMPTY_BAR_WIDTH = 17

  // List of sheet definition
  const layout = []
  let currentSheet = {
    elements: [
      {
        type: "title",
      },
      {
        type: "tempo",
      }
    ],
    height: TITLE_HEIGHT + TEMPO_HEIGHT,
  }
  layout.push(currentSheet)

  let currentFullScore = {
    type: "full-score",
    bars: [],
    width: 0,
  }
  currentSheet.height += ONE_FULL_SCORE_HEIGHT
  currentSheet.elements.push(currentFullScore)

  let nextBarIdx = 0
  let currentBar = null  // New bar will be automatically created at the beginning of the loop

  function getBeatWidth(beatIdx) {
    const BEAT_WIDTH = {
      single: 30,
      double: 54,
      triplet: 69,
      quartet: 80,
    }

    const eachInstrumentBeatWidth = definition.map(instrumentDef => {
      return BEAT_WIDTH[instrumentDef[beatIdx].type]
    })
    const beatWidth = Math.max(...eachInstrumentBeatWidth)
    return beatWidth
  }

  function newBar() {
    // Make sure fullscore is NOT overflowed, before we add new bar to it
    checkForFullScoreOverflow()

    currentBar = {
      barIdx: nextBarIdx,
      beats: [],
      width: EMPTY_BAR_WIDTH,
    }
    currentFullScore.bars.push(currentBar)
    nextBarIdx++
  }

  function checkForFullScoreOverflow() {
    let fullScoreWidth = 0
    currentFullScore.bars.map(bar => fullScoreWidth += bar.width)

    if (fullScoreWidth > MAX_FULL_SCORE_WIDTH) {
      const lastBar = currentFullScore.bars.pop()
      fullScoreWidth -= lastBar.width

      newFullScore()
      currentFullScore.bars.push(lastBar)
    }

    currentFullScore.width = fullScoreWidth
  }

  function newFullScore() {
    // Make sure we can fit new fullscore in the sheet
    checkForSheetOverflow()

    currentFullScore = {
      type: "full-score",
      bars: [],
      width: 0,
    }

    currentSheet.elements.push(currentFullScore)
    currentSheet.height += ONE_FULL_SCORE_HEIGHT
  }

  function checkForSheetOverflow() {
    if (currentSheet.height + ONE_FULL_SCORE_HEIGHT > MAX_SHEET_HEIGHT) {
      // We need new sheet to fit this full score
      currentSheet = {
        elements: [],
        height: 0,
      }
      layout.push(currentSheet)
    }
  }

  const instrumentsCount = definition.length

  for (let beatIdx = 0; beatIdx < beatsCount; beatIdx++) {
    if (beatIdx % beatsInBar == 0) {
      // We need a new bar
      newBar()
    }

    const beat = {
      index: beatIdx,
      notesPerInstrument: Array(instrumentsCount),
    }

    for (let instrumentIdx = 0; instrumentIdx < definition.length; instrumentIdx++) {
      const beatDef = definition[instrumentIdx][beatIdx]
      beat.notesPerInstrument[instrumentIdx] = []

      beatDef.notes.forEach((_symbol, noteIdx) => {
        const noteLocation = {
          instrumentIdx,
          beatIdx,
          noteIdx,
        }
        beat.notesPerInstrument[instrumentIdx].push(noteLocation)
      })
    }

    currentBar.beats.push(beat)
    const beatWidth = getBeatWidth(beatIdx)
    currentBar.width += beatWidth
  }

  // At the end - let's make sure we didin't overflow any full score
  checkForFullScoreOverflow()

  return layout
}