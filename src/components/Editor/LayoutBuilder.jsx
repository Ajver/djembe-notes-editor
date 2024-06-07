import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { buildLayout } from '../../Redux/layoutSlice'

export default function LayoutBuilder() {
  const dispatch = useDispatch()
  const rhythm = useSelector(store => store.rhythm)

  const [containerWidth, setContainerWidth] = useState(Math.min(830, document.body.offsetWidth))

  const isDesktop = containerWidth >= 830

  window.addEventListener("resize", () => {
    const newWidth = Math.min(830, document.body.offsetWidth)
    setContainerWidth(newWidth)
  })

  console.log("Container width: ", containerWidth)
  
  useEffect(() => {
    dispatch(buildLayout({rhythm, containerWidth, isDesktop}))
  }, [rhythm, dispatch, containerWidth, isDesktop])

  return null
}
