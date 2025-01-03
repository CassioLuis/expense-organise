import '@/assets/main.css'
import ReactDOM from 'react-dom/client'
import { router } from '@/router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from '@/components/ui/toaster'
import { RouterProvider } from 'react-router'
import { GlobalContextProvider } from '@/context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID_CLIENT}>
    <GlobalContextProvider>
      <RouterProvider router={router}/>
      <Toaster />
    </GlobalContextProvider>
  </GoogleOAuthProvider>
)
