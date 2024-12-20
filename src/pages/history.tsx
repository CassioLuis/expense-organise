import { useTheme } from '@/hooks/use-theme'

export default function History () {
  const { theme } = useTheme()
  return (
    <div>history {theme}</div>
  )
}
