import { Link } from "react-router-dom"
import "./css/LoginPage.css"

export default function LoginPage() {
  return (
    <div className="login-page-container">
      <h1>Welcome to Djembe notes editor</h1>
      <div className="choose-container">
        <div className="choose-box">
          <h2>Login</h2>
          <p>Syncronises your rhythms automatically in cloud, allowing you to load them from any device.</p>
          <p>Also - you can easily share your rhythms with friends - just send them the link!</p>
          <form>
            <label htmlFor="username-email">Username or email</label>
            <input type="text" name="username-email" id="username-email" required />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required />
            <p className="forgot-password"><Link to="reset-password">Forgot password</Link></p>
            <button type="submit">Login</button>
          </form>
          <p>Don't have an account yet? Sign up <Link to="signup">here</Link>!</p>
        </div>
        <div className="or"><p>or</p></div>
        <Link to="/editor" className="choose-box choose-offline" title="Click to enter offline">
          <h2>Use offline</h2>
          <p>No login required, but you need to save your rhythms manually to a file, if you don't want to loose them</p>
          <img src="/assets/svg/ui/cloud-slash.svg" alt="Offline" className="offline-img" />
          <img src="/assets/svg/ui/enter.svg" alt="Enter" className="enter-img" />
        </Link>
      </div>
    </div>
  )
}
