import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import './app.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <h1 className="">Hello World</h1>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}
