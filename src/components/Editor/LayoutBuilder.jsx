import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { buildLayout } from '../../Redux/layoutSlice'

export default function LayoutBuilder() {
  const dispatch = useDispatch()
  const rhythm = useSelector(store => store.rhythm)

  useEffect(() => {
    dispatch(buildLayout(rhythm))
  }, [rhythm, dispatch])

  return null
}
