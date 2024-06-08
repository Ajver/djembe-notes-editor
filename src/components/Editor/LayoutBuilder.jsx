import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { generateLayout } from '../../Redux/layoutSlice'
import { MOBILE_MAX_WIDTH } from "../../constants/MobileUi"

export default function LayoutBuilder() {
  const dispatch = useDispatch()
  const rhythm = useSelector(store => store.rhythm)

  const [containerWidth, setContainerWidth] = useState(Math.min(MOBILE_MAX_WIDTH, window.innerWidth))

  const toDesktop = containerWidth > MOBILE_MAX_WIDTH

  window.addEventListener("resize", () => {
    const newWidth = Math.min(MOBILE_MAX_WIDTH, window.innerWidth)
    setContainerWidth(newWidth)
  })

  console.log("Container width: ", containerWidth)
  
  useEffect(() => {
    dispatch(generateLayout({rhythm, containerWidth, toDesktop}))
  }, [rhythm, dispatch, containerWidth, toDesktop])

  return null
}
