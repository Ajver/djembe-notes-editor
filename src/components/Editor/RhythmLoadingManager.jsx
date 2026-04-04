import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import loadRhythmFromLocalStorage from "../../helpers/loadRhythmFromLocalStorage"
import { hasRhythmInUrl, loadRhythmFromUrl, clearRhythmFromUrl } from "../../helpers/loadRhythmFromUrl"
import ConfirmationPopup from "./ConfirmationPopup"
import { setExportModalVisibility } from "../../Redux/modalsSlice";

export default function RhythmLoadingManager({ setInitiallyLoaded }) {
  const dispatch = useDispatch()

  const [confirmationPopupVisible, setConfirmationPopupVisible] = useState(false)

  useEffect(() => {
    // TODO: loadRhythmFromDb() ||
    const lodedFromStorage = loadRhythmFromLocalStorage(dispatch)

    if (hasRhythmInUrl()) {
      console.log("has rhythm in url.")
      if (lodedFromStorage) {
        setConfirmationPopupVisible(true)
      } else {
        // Nothing to override!
        onConfirm()
      }
    } else {
      setInitiallyLoaded(true)
    }
  })

  function onConfirm() {
    loadRhythmFromUrl(dispatch)
    clearRhythmFromUrl()
    setInitiallyLoaded(true)
  }

  function onCancel() {
    clearRhythmFromUrl()
    setInitiallyLoaded(true)
  }

  function showExportModal() {
      dispatch(setExportModalVisibility(true))
  }

  return (confirmationPopupVisible && 
    <ConfirmationPopup onConfirm={onConfirm} onCancel={onCancel}>
      <h2>Override previous rhythm?</h2>
      <p>The url contains a new rhythm. Loading it will override previously saved rhythm. Are you sure?</p>
      <p>If you don't want to loose your previous rhythm, download it now:</p>
      <div>
        <button onClick={showExportModal} type='button'>DOWNLOAD</button>
      </div>
    </ConfirmationPopup>
  )
}