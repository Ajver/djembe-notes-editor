import { Link } from "react-router-dom"
import "./css/SignInUpPageCommon.css"

export default function ResetPassword() {
  return (
    <main className="sign-in-up-page-container">
      <h1>Forgot your password?</h1>
      <section className="choose-container">
        <section className="choose-box">
          <h2>Reset password</h2>
          <ResetPasswordForm />
          <p>Go back to Log in page <Link to="/login">here</Link></p>
        </section>
      </section>
    </main>
  )
}

function ResetPasswordForm() {
  return (
    <form>
      <label htmlFor="email">Enter your email</label>
      <input type="email" name="email" id="email" required />
      <button type="submit">Send email</button>
    </form>
  )
}