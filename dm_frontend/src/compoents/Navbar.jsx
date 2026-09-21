import React from 'react'
import "./Navbar.css";
import horizontal_logo from '../assets/horizontal_logo.svg'
import DropDownNavArrow from "../assets/DropDownNavArrow.svg"
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className='nav-bg navbar'>
       <Link to="/"  className='horizontal_logo_nav'>
         <img src={horizontal_logo} alt='Design Master'/>
       </Link>

       <div className='nav-items  '>
            <Link to="/generator" className='p text-white navlink'>Generator</Link>
            <Link to="/saved-topics" className='p text-white navlink'>Saved Topics</Link>
            <Link to="/experience-centre" className='p text-white navlink'>Experience Centre</Link>
            
            <div className="myprofile text-white p">

          
                <div className="profile_icon">
                    <p className="initials">J</p>
                </div>

                <span>My Profile</span>

                <img className="drop_down_arrow" src={DropDownNavArrow} alt="dropdown arrow" />

                <div className="dropdown-menu">
                    <div className="dropdown-content">
                        <p>Account Details</p>
                        <p>Log Out</p>
                     </div>
                  </div>
              </div>
            </div>

       
    </div>
  )
}

export default Navbar