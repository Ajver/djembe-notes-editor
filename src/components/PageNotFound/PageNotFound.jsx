import Link from "../Common/Link"
import "./css/PageNotFound.css"

export default function PageNotFound() {
  return (
    <div className="page-not-found-container">
      <h3>404</h3>
      <img src="assets/img/broken-djembe.png" alt="Page not found" className="page-not-found-image" />
      <p>Page not found. <Link to="/">Return to editor</Link></p>
    </div>
  )
}