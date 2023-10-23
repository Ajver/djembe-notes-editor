import { useSelector } from "react-redux"
import saveRhythmToTxt from "../../helpers/saveRhythmToTxt"
import { RHYTHM_KEY } from "../../constants/LocalStorage"

export default function LocalStorageSaver() {
  const rhythm = useSelector(store => store.rhythm)

  const rhythmTxt = saveRhythmToTxt(rhythm)
  localStorage.setItem(RHYTHM_KEY, rhythmTxt)
  console.log("SaVED!", rhythmTxt)

  return (null)
}
