import { Link } from "react-router-dom"
import "./css/PageNotFound.css"

export default function PageNotFound() {
  return (
    <div className="page-not-found-container">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">Return to home page</Link>
    </div>
  )
}