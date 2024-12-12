import '@/assets/main.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import React from 'react'
import router from './router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// const App = React.lazy(() => import('./App'))
// const Starred = React.lazy(() => import('./pages/starred'))
// const History = React.lazy(() => import('./pages/history'))
// const Settings = React.lazy(() => import('./pages/settings'))
