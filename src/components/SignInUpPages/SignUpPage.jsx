import { useRef, useState } from "react";
import UseOfflineBox from "./UseOfflineBox";
import "./css/SignInUpPageCommon.css"
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <main className="sign-in-up-page-container">
      <h1>Joining Djembe notes editor?</h1>
      <section className="choose-container">
        <section className="choose-box">
          <h2>Create new account</h2>
          <SignUpForm />
          <p>Already have an account? Log in <Link to="/login">here</Link></p>
        </section>
        <div className="or"><p>or</p></div>
        <UseOfflineBox />
      </section>
    </main>
  )
}

function SignUpForm() {
  const userRef = useRef()

  const [username, setUsername] = useState("")
  const [isUsernameValid, setUsernameValid] = useState(false)
  const [usernameFocus, setUsernameFocus] = useState(false)

  const [email, setEmail] = useState("")
  const [isEmailValid, setEmailValid] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [password, setPassword] = useState("")
  const [passwordFocus, setPasswordFocus] = useState(false)

  const [matchPassword, setMatchPassword] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [matchPasswordFocus, setMatchPasswordFocus] = useState(false)

  return (
    <form>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="username" required autoComplete="off" />

      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" required autoComplete="off" />

      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" required autoComplete="off" />

      <label htmlFor="password-match">Repeat password</label>
      <input type="password" name="password-match" id="password-match" required autoComplete="off" />

      <button type="submit">Sign Up</button>
    </form>
  )
}