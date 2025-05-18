import React from 'react'
import Navbar from '../components/Navbar'
import BatchList from '../components/BatchList'
import ProtectedAuth from './ProtectedAuth'

export default function HeroSectionPage() {
  return (
    <ProtectedAuth>
      <Navbar />
      <BatchList />
    </ProtectedAuth>

  )
}
