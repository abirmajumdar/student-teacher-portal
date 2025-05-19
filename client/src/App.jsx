import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import CoursesPage from './pages/CoursesPage'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/view-courses/:id' element={<CoursesPage/>}/>
    </Routes>
      
    </BrowserRouter>
     
    </>
  )
}

export default App
