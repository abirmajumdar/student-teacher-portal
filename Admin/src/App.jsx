import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<AdminDashboard/>} />
      </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
