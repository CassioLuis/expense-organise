import '@/assets/main.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import React from 'react'
import router from './router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppDependenciesProvider } from './app-dependencies-context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID_CLIENT}>
      <AppDependenciesProvider>
        <RouterProvider router={router} />
      </AppDependenciesProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
