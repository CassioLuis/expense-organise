import "./assets/main.css"
import { Button } from './components/ui/button'
import Layout from './Layout'

function App() {

  return (
    <main className="h-full flex items-center justify-center">
      <Layout>
        <Button size={'lg'}>teste</Button>
      </Layout>
    </main>
  )
}

export default App
