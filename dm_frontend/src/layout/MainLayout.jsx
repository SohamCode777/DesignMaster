import React from 'react'
import "../App.css";
import Navbar from '../compoents/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../compoents/Footer'

function MainLayout() {
  const location = useLocation();

  const isExperienceChat = location.pathname.startsWith('/experience/');

  return (
    <div className='main-background-image'>
      <Navbar />
      <Outlet />
      {!isExperienceChat && <Footer />}
    </div>
  )
}

export default MainLayout