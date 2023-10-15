import React from 'react'
import "./css/TipsPanel.css"

export default function TipsPanel() {
  return (
    <div className="tips-panel">
      <div className="key-tips-container">
          <div className="key-tip">`~<img src="assets/svg/dash.svg" /></div>
          <div className="key-tip">1!<img src="assets/svg/bass.svg" /></div>
          <div className="key-tip">2@<img src="assets/svg/tone.svg" /></div>
          <div className="key-tip">3#<img src="assets/svg/cross.svg" /></div>
          <div className="key-tip">4$<img src="assets/svg/ghost.svg" /></div>
          <div className="key-tip">Shift + 1<p>single</p><img src="assets/svg/cross.svg" /></div>
          <div className="key-tip double">Shift + 2<img src="assets/svg/cross.svg" /><img src="assets/svg/dash.svg" /></div>
          <div className="key-tip triplet">Shift + 3<img src="assets/svg/cross.svg" /><img src="assets/svg/dash.svg" /><img src="assets/svg/dash.svg" /></div>
          <div className="key-tip">Shift<p>multiselect</p></div>
      </div>

      <button className="tips-panel-hide-btn" id="tips-panel-hide-btn">HIDE</button>
    </div>
  )
}
