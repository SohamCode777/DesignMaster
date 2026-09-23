import React, { useContext, useState } from 'react'
import "./Auth.css";
import horizontal_logo from '../assets/horizontal_logo.svg'
import visibility_turn_on from "../assets/visibility_turn_on.svg";
import visibility_turn_off from "../assets/visibility_turn_off.svg";

import FooterAuth from '../compoents/FooterAuth';
import { useNavigate } from 'react-router-dom';
import { DMContext } from '../context/DMContext';
import axios from 'axios';
import { toast } from "react-toastify";


function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const{setCurrentUser} = useContext(DMContext);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
});

  const navigate= useNavigate();

   const onRegisterHandler = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
            { user },
            { withCredentials: true }
        );

        console.log(response.data);

        await setCurrentUser();

        navigate("/");
    } catch (error) {
        console.log(error.response?.data);
         toast.error(error.response?.data?.message || "Something went wrong");
    }
};

  return (
   <>
    <div className='auth-container'>

      <div className='form-section'>
        <p className='p user-text'>Existing User? <b className='account-creation-text' onClick={()=>{navigate("/login")}}>Log in to your account.</b></p>
        <h4 className='h4 auth-title'>Register</h4>
        <p className='p sub-heading'>Hi There! Please fill in the details below:</p>

        <form onSubmit={onRegisterHandler}>

        <div className="form-field">
            <label className='form-label' htmlFor="name">Full Name</label>
            <input className='input-section' type="text" id="name" name="name" value={user.name} placeholder=" Enter your name" onChange={(e)=>setUser({...user,name:e.target.value})} required/>
        </div>

          <div className="form-field">
            <label className='form-label' htmlFor="email">Email</label>
            <input className='input-section' type="email" id="email" name="email" value={user.email} placeholder=" Enter your email"  onChange={(e)=>setUser({...user,email:e.target.value})} required/>
          </div>

          <div className="form-field">
                <label className='form-label' htmlFor="password">Password</label>

                <div className="input-wrapper">
                  <input className='input-section' type={showPassword ? "text" : "password"} id="password" name="password" value={user.password} placeholder=" Enter your password" onChange={(e)=>setUser({...user,password:e.target.value})} required />
                  <img className="password-icon" src={showPassword ? visibility_turn_on : visibility_turn_off} alt="Toggle password visibility" onClick={() => setShowPassword(!showPassword)} />
                </div>

            </div>

          <button className=' primary-button  login-button' type="submit">Register</button>


        </form>
      </div>

      <div className='side-banner'>
        <img className='logo' src={horizontal_logo} alt='Design Master Logo'/>
        <h1 className='text-white banner-heading'>Your Creativity Has A New Friend!</h1>
        <ul className='banner-list'>
          <li className='text-white h6 banner-list-item'>Unleash Creativity Without Resistance</li>
          <li className='text-white h6 banner-list-item'>Find New Challenging Topics To Master The Craft</li>
          <li className='text-white h6 banner-list-item'>With AI Integration, Explore What Industry-Relevant Workflow Looks Like</li>
        </ul>
      </div>
         
    </div>
    
    <FooterAuth/>
     
    </> 

  )
}

export default Register;