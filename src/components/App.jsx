import { useState } from "react"
import Editor from './Editor/Editor'
import LoginPage from "./LoginPage/LoginPage"
import PageNotFound from "./PageNotFound/PageNotFound"

function App() {
  const [page, setPage] = useState("login")
  const pageName = window.location.pathname
  console.log("Location:", pageName)

  let component

  switch (pageName) {
    case "/":
      component = <LoginPage />
      break
    case "/login":
      component = <LoginPage />
      break
    case "/editor":
      component = <Editor />
      break
    default:
      component = <PageNotFound />
  }

  return <>{component}</>
}

export default App
