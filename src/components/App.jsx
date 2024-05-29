import { useState } from "react"
import Editor from './Editor/Editor'
import LoginPage from "./LoginPage/LoginPage"
import PageNotFound from "./PageNotFound/PageNotFound"

function App() {
  const pageName = window.location.pathname

  const component = {
    "/": <LoginPage />,
    "/login": <LoginPage />,
    "/editor": <Editor />,
  }[pageName] || <PageNotFound />

  return <>{component}</>
}

export default App
