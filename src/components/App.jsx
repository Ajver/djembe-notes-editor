import Editor from './Editor/Editor'
import LoginPage from "./SignInUpPages/LoginPage"
import PageNotFound from "./PageNotFound/PageNotFound"
import { Route, Routes } from "react-router-dom"
import SignUpPage from "./SignInUpPages/SignUpPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignUpPage />}/>
        <Route path="/editor" element={<Editor />}/>
        <Route path="*" element={<PageNotFound />}/>
      </Routes>
    </>
  )
}

export default App
