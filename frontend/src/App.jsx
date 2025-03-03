import { useState } from 'react'
import './App.css'
import Rolling from './pages/Rolling'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Rolling />
    </div>
  )
}

export default App
