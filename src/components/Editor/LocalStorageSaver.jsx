import { useSelector } from "react-redux"
import saveRhythmToTxt from "../../helpers/saveRhythmToTxt"
import { RHYTHM_KEY } from "../../constants/LocalStorage"
import { useEffect } from "react"

export default function LocalStorageSaver() {
  const rhythm = useSelector(store => store.rhythm)

  useEffect(() => {
    const rhythmTxt = saveRhythmToTxt(rhythm)
    localStorage.setItem(RHYTHM_KEY, rhythmTxt)
  }, [rhythm])

  return (null)
}
