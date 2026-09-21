import React from 'react'
import "./Footer.css";
import SkillSpace_Horizontal_Alignment from '../assets/SkillSpace_Horizontal_Alignment.svg'
import copyright_icon from '../assets/copyright_icon.svg';
import facebook_icon from '../assets/facebook_icon.svg';
import instagram_icon from '../assets/instagram_icon.svg';
import twitter_icon from '../assets/twitter_icon.svg';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer'>
     <div className='skillspace'>
            <img src={SkillSpace_Horizontal_Alignment} alt='SkillSpace Logo'/>
          <div className='copyright'>
            <img className='copyright-icon' src={copyright_icon} alt='Copyright Icon'/>
            <p className='copyright-text text-dark micro'>2026 SkillSpace. DesignMaster is a SkillSpace product. All rights reserved.</p>
          </div>
     </div>

     <div className='footer-links '>
      <Link className='footer-link text-dark small'>About</Link>
      <Link className='footer-link text-dark small'>Contact</Link>
      <Link className='footer-link text-dark small'>Privacy</Link>
      <Link className='footer-link text-dark small'>Terms</Link>
      <Link className='footer-link text-dark small'>
        <img src={instagram_icon} alt='instagram icon'/>
      </Link>
      <Link className='footer-link text-dark small'>
        <img src={facebook_icon} alt='facebook icon'/>
      </Link>
      <Link className='footer-link text-dark small'>
        <img src={twitter_icon} alt='twitter icon'/>
      </Link>
      
     </div>
    </div>
  )
}

export default Footer