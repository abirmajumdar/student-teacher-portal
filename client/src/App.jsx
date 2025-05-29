import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import CoursesPage from './pages/CoursesPage'

function App() {
  const batchToken = localStorage.getItem('batchToken')
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/view-courses/:id'  element={batchToken? <CoursesPage/>:<LandingPage/>}/>
    </Routes>
      
    </BrowserRouter>
     
    </>
  )
}

export default App
