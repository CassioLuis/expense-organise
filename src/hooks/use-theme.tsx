import { useEffect, useState } from 'react'

type Themes = 'light' | 'dark'

export function useTheme () {
  const localTheme = localStorage.getItem('theme') as Themes || 'dark'
  const [theme, setTheme] = useState<Themes>(localTheme)
  const toggleTheme = () => setTheme((prev) => prev === 'light' ? 'dark' : 'light')

  useEffect(() => {
    localStorage.setItem('theme', theme)
    const body = document.querySelector('body')
    if (!body) return
    body.classList.remove('light', 'dark')
    body.classList.add(theme)
  }, [theme])

  return {
    theme,
    toggleTheme
  }
}
