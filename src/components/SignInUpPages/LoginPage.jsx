import { Link } from "react-router-dom"
import "./css/SignInUpPageCommon.css"
import "./css/LoginPage.css"
import UseOfflineBox from "./UseOfflineBox"

export default function LoginPage() {
  return (
    <div className="sign-in-up-page-container">
      <h1>Welcome to Djembe notes editor</h1>
      <div className="choose-container">
        <div className="choose-box">
          <h2>Login</h2>
          <p>Saves your rhythms automatically in cloud, allowing you to load them from any device.</p>
          <p>You can also easily share your rhythms with friends - just send them the link!</p>
          <form>
            <label htmlFor="username-email">Username or email</label>
            <input type="text" name="username-email" id="username-email" required />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required />
            <p className="forgot-password"><Link to="/reset-password">Forgot password</Link></p>
            <button type="submit">Login</button>
          </form>
          <p>Don't have an account yet? Sign up <Link to="/signup">here</Link>!</p>
        </div>
        <div className="or"><p>or</p></div>
        <UseOfflineBox />
      </div>
    </div>
  )
}
