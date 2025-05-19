import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HeroSectionPage from './pages/HeroSectionPage'
import CourseUpload from './pages/CourseUpload'
import CoursesPage from './pages/CoursesPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter >

      <Routes>
        <Route path='/' element={<AuthPage/>} />
        <Route path='/dashboard' element={<HeroSectionPage/>} />
        <Route path='/course-upload/:id' element={<CourseUpload/>} />
        <Route path='/view-courses/:id' element={<CoursesPage/>} />
        
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
