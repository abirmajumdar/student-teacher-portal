import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HeroSectionPage from './pages/HeroSectionPage'
import CourseUpload from './pages/CourseUpload'
import CoursesPage from './pages/CoursesPage'
import AllBatches from './pages/AllBatches'
import AllAssignmentPage from './pages/AllAssignmentPage'

function App() {
  const [count, setCount] = useState(0)
  const authUser = localStorage.getItem('token')
  return (
    <div>
      <BrowserRouter >

      <Routes>
             
        <Route path='/auth' element={<AuthPage/>} />
        
       
        <Route path='/' element={authUser?<HeroSectionPage/>:<AuthPage/>} />
        <Route path='/course-upload/:id' element={<CourseUpload/>} />
        <Route path='/view-courses/:id' element={<CoursesPage/>} />
        <Route path='/all-batches' element={<AllBatches/>} />
        <Route path='/all-assignments-by-Id/:id' element={<AllAssignmentPage/>} />
        
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
