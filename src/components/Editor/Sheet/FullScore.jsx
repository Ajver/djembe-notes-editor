import React from 'react'
import "./css/FullScore.css"
import Bar from './Bar'

export default function FullScore() {
  return (
    <div className="full-score">
      <Bar nums={[[2, 3], [4, 1], [3, 1], [1, 1]]} />
      <Bar nums={[[1, 1], [1, 2], [1, 1], [4, 3]]} />
      <Bar nums={[[1, 1], [1, 1], [1, 1], [1, 1]]} />
      <Bar nums={[[1, 1], [1, 1], [1, 1], [1, 1]]} />
    </div>
  )
}
