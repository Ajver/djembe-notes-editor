import { useState } from 'react'
import Editor from './Editor/Editor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Editor />
    </>
  )
}

export default App
