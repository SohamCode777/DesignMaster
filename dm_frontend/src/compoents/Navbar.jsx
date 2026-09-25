import React from 'react'
import "./Navbar.css";
import horizontal_logo from '../assets/horizontal_logo.svg'
import DropDownNavArrow from "../assets/DropDownNavArrow.svg"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { DMContext } from '../context/DMContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(DMContext);

  if (loading) {
    return null;
}
  const name_initial= user.name.trim().charAt(0).toUpperCase();

  const handleLogOut = async () => {
    try {
        await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
            {},
            { withCredentials: true }
        );

        setUser(null);

        navigate('/login');
    } catch (error) {
        console.log(error.response?.data);
         toast.error(error.response?.data?.message || "Something went wrong");
    }
}


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
                    <p className="initials">{name_initial}</p>
                </div>

                <span>My Profile</span>

                <img className="drop_down_arrow" src={DropDownNavArrow} alt="dropdown arrow" />

                <div className="dropdown-menu">
                    <div className="dropdown-content">
                        <p onClick={()=> navigate("/account-details")}>Account Details</p>
                        <p onClick={handleLogOut}>Log Out</p>
                     </div>
                  </div>
              </div>
            </div>

       
    </div>
    
  )
}

export default Navbar