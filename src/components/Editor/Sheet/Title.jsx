import React, { useState } from 'react'
import InputLabelContainer from "./InputLabelContainer"
import "./css/Title.css"

export default function Title() {
  const [title, setTitle] = useState("Initial title")

  return (
    <InputLabelContainer className="title" text={title} editCallback={setTitle} />
  )
}
