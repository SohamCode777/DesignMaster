import React from 'react'
import "../App.css";
import Navbar from '../compoents/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../compoents/Footer'

function MainLayout() {
  return (
   <>
   <div className='main-background-image'>
      <Navbar />

      <Outlet />

      <Footer/>

  </div>
   
   </>
  )
}

export default MainLayout