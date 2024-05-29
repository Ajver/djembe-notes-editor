import { Link } from "react-router-dom";
import "./css/UseOfflineBox.css"

export default function UseOfflineBox() {
  return (
    <Link to="/editor" className="choose-box choose-offline" title="Click to enter offline">
      <h2>Use offline</h2>
      <p>No login required, but you need to save your rhythms manually to a file, if you don't want to loose them</p>
      <img src="/assets/svg/ui/cloud-slash.svg" alt="Offline" className="offline-img" />
      <img src="/assets/svg/ui/enter.svg" alt="Enter" className="enter-img" />
    </Link>
  )
}