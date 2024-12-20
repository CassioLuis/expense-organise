import { useState } from 'react'

export default function () {
  const [user, setUser] = useState(null)

  const handleUser = (data: any) => setUser(() => data)

  return {
    user,
    handleUser
  }
}