import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { rangeSelect } from "../../Redux/editorSlice"
import { calculateNoteNumber } from "../../helpers/noteNumber"
import "./css/SelectionHandles.css"
import { MOBILE_MAX_WIDTH } from "../../constants/MobileUi"

export default function SelectionHandles() {
  const selectionStartIdx = useSelector(store => store.editor.selectionStartIdx)
  const selectionStartInstrument = useSelector(store => store.editor.selectionStartInstrument)
  const selectionEndIdx = useSelector(store => store.editor.selectionEndIdx)
  const selectionEndInstrument = useSelector(store => store.editor.selectionEndInstrument)
  const isMobileMultiSelecting = useSelector(store => store.editor.isMobileMultiSelecting)

  const isDesktopVersion = window.innerWidth > MOBILE_MAX_WIDTH

  const dispatch = useDispatch()

  const [startPos, setStartPos] = useState({ top: 0, left: 0 })
  const [endPos, setEndPos] = useState({ top: 0, left: 0 })

  const startHandleRef = useRef(null)
  const endHandleRef = useRef(null)


  const halfSize = 15

  function positionHandlerOnNote(note, start) {
    if (note) {
      const bodyRect = document.body.getBoundingClientRect()
      const rect = note.getBoundingClientRect()
      
      if (start) {
        setStartPos({
          top: -bodyRect.top + rect.top + rect.height / 2,
          left: -bodyRect.left + rect.left - halfSize*2,
        })
      } else {
        setEndPos({
          top: -bodyRect.top + rect.top + rect.height / 2,
          left: -bodyRect.left + rect.left + rect.width,
        })
      }
    }
  }

  useEffect(() => {
    if (!isMobileMultiSelecting) return

    const startElement = document.querySelector('.note.selection-start')
    const endElement = document.querySelector('.note.selection-end')

    positionHandlerOnNote(startElement, true)
    positionHandlerOnNote(endElement, false)
  }, [selectionStartIdx, selectionStartInstrument, selectionEndIdx, selectionEndInstrument, isMobileMultiSelecting])

  function getNoteDetailsUnder(x, y) {
      const elements = document.elementsFromPoint(x, y)
      const closestNotes = elements.filter((el) => el.classList.contains("note"))
      if (closestNotes.length === 0) {
        return null
      }

      const noteElement = closestNotes[0]
      const instrumentIdx = parseInt(noteElement.dataset.instrumentIdx)
      const beatIdx = parseInt(noteElement.dataset.beatIdx)
      const noteIdx = parseInt(noteElement.dataset.noteIdx)
      const noteNumber = calculateNoteNumber(beatIdx, noteIdx)
      return {
        instrumentIdx,
        noteNumber,
      }
  }

  const handleStartDrag = () => {
    const handleMove = (moveEvent) => {
      moveEvent.preventDefault()
      const moveTouch = moveEvent.touches[0]

      const bodyRect = document.body.getBoundingClientRect()
      setStartPos({
        top: -bodyRect.top + moveTouch.clientY - halfSize,
        left: -bodyRect.left + moveTouch.clientX - halfSize,
      })

      const noteDetails = getNoteDetailsUnder(moveTouch.clientX, moveTouch.clientY)
      if (noteDetails) {
        const {noteNumber, instrumentIdx} = noteDetails
        if (noteNumber <= selectionEndIdx && instrumentIdx <= selectionEndInstrument) {
          dispatch(rangeSelect({
            selectionStartIdx: noteNumber,
            selectionStartInstrument: instrumentIdx,
            selectionEndIdx,
            selectionEndInstrument,
          }))
        }else {
          dispatch(rangeSelect({
            selectionStartIdx: noteNumber,
            selectionStartInstrument: instrumentIdx,
            selectionEndIdx: noteNumber,
            selectionEndInstrument: instrumentIdx,
          }))
        }
      }
    }

    const handleEnd = () => {
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)

      const startElement = document.querySelector('.note.selection-start')
      positionHandlerOnNote(startElement, true)
    }

    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)
  }

  const handleEndDrag = () => {
    const handleMove = (moveEvent) => {
      moveEvent.preventDefault()
      const moveTouch = moveEvent.touches[0]

      const bodyRect = document.body.getBoundingClientRect()
      setEndPos({
        top: -bodyRect.top + moveTouch.clientY - halfSize,
        left: -bodyRect.left + moveTouch.clientX - halfSize,
      })

      const noteDetails = getNoteDetailsUnder(moveTouch.clientX, moveTouch.clientY)
      if (noteDetails) {
        const {noteNumber, instrumentIdx} = noteDetails

        if (noteNumber >= selectionStartIdx && instrumentIdx >= selectionStartInstrument) {
          dispatch(rangeSelect({
            selectionStartIdx,
            selectionStartInstrument,
            selectionEndIdx: noteNumber,
            selectionEndInstrument: instrumentIdx,
          }))
        }else {
          dispatch(rangeSelect({
            selectionStartIdx: noteNumber,
            selectionStartInstrument: instrumentIdx,
            selectionEndIdx: noteNumber,
            selectionEndInstrument: instrumentIdx,
          }))
        }
      }
    }

    const handleEnd = () => {
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)

      const endElement = document.querySelector('.note.selection-end')
      positionHandlerOnNote(endElement, false)
    }

    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)
  }

  if (isDesktopVersion || !isMobileMultiSelecting) return null

  return (
    <>
      <div
        ref={startHandleRef}
        className="selection-handle selection-handle-start"
        style={{ top: startPos.top, left: startPos.left }}
        onTouchStart={handleStartDrag}
      >
        <img src="assets/img/drop.png" alt="Select start" />
      </div>
      <div
        ref={endHandleRef}
        className="selection-handle selection-handle-end"
        style={{ top: endPos.top, left: endPos.left }}
        onTouchStart={handleEndDrag}
      >
        <img src="assets/img/drop.png" alt="Select end" />
      </div>
    </>
  )
}