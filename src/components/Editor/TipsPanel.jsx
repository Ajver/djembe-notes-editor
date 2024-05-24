import React from 'react'
import "./css/TipsPanel.css"

export default function TipsPanel({visible, toggleVisibility}) {
  return (
    <div className={"tips-panel " + (visible ? "" : "hidden")}>
      <div className="key-tips-container">
        <section>
          <header>
            <h4>Changing note</h4>
          </header>
          <div className="tips-list">
            <div className="key-tip">`~<img src="/assets/svg/dash.svg" /></div>
            <div className="key-tip">1!<img src="/assets/svg/bass.svg" /></div>
            <div className="key-tip">2@<img src="/assets/svg/tone.svg" /></div>
            <div className="key-tip">3#<img src="/assets/svg/cross.svg" /></div>
            <div className="key-tip">4$<img src="/assets/svg/ghost.svg" /></div>
          </div>
        </section>
        <section>
          <header>
            <h4>Changing beat type</h4>
          </header>
          <div className="tips-list">
            <div className="key-tip">Shift + 1<p>single</p><img src="/assets/svg/cross.svg" /></div>
            <div className="key-tip double">Shift + 2<img src="/assets/svg/cross.svg" /><img src="/assets/svg/dash.svg" /></div>
            <div className="key-tip triplet">Shift + 3<img src="/assets/svg/cross.svg" /><img src="/assets/svg/dash.svg" /><img src="/assets/svg/dash.svg" /></div>
            <div className="key-tip quartet">Shift + 4<img src="/assets/svg/cross.svg" /><img src="/assets/svg/dash.svg" /><img src="/assets/svg/dash.svg" /><img src="/assets/svg/dash.svg" /></div>
          </div>
        </section>
        <section>
          <header>
            <h4>Shortcuts</h4>
          </header>
          <div className="tips-list">
            <div className="key-tip">Shift<p>multiselect</p></div>
            <div className="key-tip">Ctrl + A<p>select all</p></div>
            <div className="key-tip">Ctrl + V<p>paste</p></div>
            <div className="key-tip">Ctrl + C<p>copy selected</p></div>
            <div className="key-tip">Ctrl + X<p>cut selected</p></div>
          </div>
        </section>
      </div>
      <button className="tips-panel-hide-btn" onClick={toggleVisibility}>HIDE</button>
    </div>
  )
}
