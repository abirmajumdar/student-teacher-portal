import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HeroSectionPage from './pages/HeroSectionPage'
import CourseUpload from './pages/CourseUpload'
import CoursesPage from './pages/CoursesPage'
import AllBatches from './pages/AllBatches'


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
        <Route path='all-batches' element={<AllBatches/>} />
        
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
