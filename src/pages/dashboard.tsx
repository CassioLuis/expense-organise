import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import userStore from '@/store/user-store'
import { useEffect } from 'react'

export default function Dashboard () {
  const { toggleTheme } = useTheme()
  const { user, handleUser } = userStore()

  useEffect(() => handleUser(localStorage.getItem('access-token')), [])

  return (
    <div>
      <Button
        variant="default"
        onClick={toggleTheme}
      >
        Theme
      </Button>
      {user}
    </div>
  )
}
