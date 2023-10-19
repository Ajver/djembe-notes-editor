import React from 'react'
import Sheet from "./Sheet/Sheet"
import "./css/ToPrint.css"
import { useSelector } from "react-redux"

export default function ToPrint() {
  const rhythmStore = useSelector(store => store.rhythm)
  const { 
    definition,
    beatsCount,
    beatsInBar,
  } = rhythmStore

  // List of sheet definition
  const structure = []
  let currentSheet = {
    elements: [
      {
        type: "title",
      },
      {
        type: "tempo",
      }
    ],
    height: 88,  // Height of title + tempo
  }
  structure.push(currentSheet)

  let currentFullScore = {
    type: "full-score",
    bars: [],
    width: 0,
  }
  currentSheet.elements.push(currentFullScore)

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

  const ONE_FULL_SCORE_HEIGHT = definition.length * 50 + 40

  const MAX_SHEET_HEIGHT = 1060
  const MAX_FULL_SCORE_WIDTH = 730

  function newBar() {
    // Make sure fullscore is NOT overflowed, before we add new bar to it
    checkForFullScoreOverflow()

    currentBar = {
      beats: [],
      width: 17,  // 15px is padding + 2px bar line
    }
    currentFullScore.bars.push(currentBar)
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
      structure.push(currentSheet)
    }
  }

  for (let i = 0; i < beatsCount; i++) {
    if (i % beatsInBar == 0) {
      // We need a new bar
      newBar()
    }

    currentBar.beats.push(i)
    const beatWidth = getBeatWidth(i)
    currentBar.width += beatWidth
  }

  // At the end - let's make sure we didin't overflow any full score
  checkForFullScoreOverflow()

  console.log(structure)

  return (
    <div className="to-print">
      {
        structure.map((sheetStructure, idx) => (
          <Sheet key={idx} id={"sheet-" + idx} elements={sheetStructure.elements} />
        ))
      }
    </div>
  )
}
