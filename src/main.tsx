import '@/assets/main.css'
import '@/assets/datepicker.css'
// import 'react-datepicker/dist/react-datepicker.css'
import ReactDOM from 'react-dom/client'
import { router } from '@/protected-route'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from '@/components/ui/toaster'
import { RouterProvider } from 'react-router'
import { GlobalContextProvider } from '@/context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID_CLIENT}>
    <GlobalContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </GlobalContextProvider>
  </GoogleOAuthProvider>
)
