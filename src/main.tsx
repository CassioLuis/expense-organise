import '@/assets/main.css'
import '@/assets/datepicker.css'
// import 'react-datepicker/dist/react-datepicker.css'
import ReactDOM from 'react-dom/client'
import { router } from '@/protected-route'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from '@/components/ui/toaster'
import { RouterProvider } from 'react-router'
import { GlobalContextProvider } from '@/contexts'
import { DateRangeProvider } from '@/contexts/DateRangeContext'
import { ThemeProvider } from '@/components/theme-provider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID_CLIENT}>
    <GlobalContextProvider>
      <DateRangeProvider>
        <ThemeProvider
          defaultTheme="dark"
          storageKey="theme"
        >
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </DateRangeProvider>
    </GlobalContextProvider>
  </GoogleOAuthProvider>
)
