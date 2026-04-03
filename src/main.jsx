import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import "./main.css"
import store from "./Redux/store"
import { Provider } from "react-redux"
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={ store }>
      <DndProvider backend={ HTML5Backend }>
        <App/>
      </DndProvider>
    </Provider>
  </React.StrictMode>,
)
