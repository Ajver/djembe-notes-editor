import { useSelector } from "react-redux"
import saveRhythmToTxt from "../../helpers/saveRhythmToTxt"
import { RHYTHM_KEY } from "../../constants/LocalStorage"
import { useEffect } from "react"

export default function LocalStorageSaver() {
  const rhythm = useSelector(store => store.rhythm)
  const canAutosave = useSelector(store => store.editor.canAutosave)

  useEffect(() => {
    if (canAutosave) {
      const rhythmTxt = saveRhythmToTxt(rhythm)
      localStorage.setItem(RHYTHM_KEY, rhythmTxt)
      console.log("SaVED!", rhythmTxt)
    }
  }, [rhythm, canAutosave])

  return (null)
}
