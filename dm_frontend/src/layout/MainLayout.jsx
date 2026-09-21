import React from 'react'
import Navbar from '../compoents/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../compoents/Footer'

function MainLayout() {
  return (
   <>
      <Navbar />

      <Outlet/>

      <Footer/>
   
   </>
  )
}

export default MainLayout