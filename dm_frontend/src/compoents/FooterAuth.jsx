import React from 'react'
import "./FooterAuth.css";
import SkillSpace_Horizontal_Alignment_Primary_White from '../assets/SkillSpace_Horizontal_Alignment_Primary_White.svg'
import copyright_icon_white from '../assets/copyright_icon_white.svg';
import facebook_icon_white from '../assets/facebook_icon_white.svg';
import instagram_icon_white from '../assets/instagram_icon_white.svg';
import twitter_icon_white from '../assets/twitter_icon_white.svg';
import { Link } from 'react-router-dom';

function FooterAuth() {
  return (
    <div className='footer-dark'>
     <div className='skillspace-white'>
            <img src={SkillSpace_Horizontal_Alignment_Primary_White} alt='SkillSpace Logo'/>
          <div className='copyright-white'>
            <img className='copyright-icon-white' src={copyright_icon_white} alt='Copyright Icon'/>
            <p className='copyright-text-white text-white micro'>2026 SkillSpace. DesignMaster is a SkillSpace product. All rights reserved.</p>
          </div>
     </div>

     <div className='footer-links-white '>
      <Link className='footer-link-white text-white small'>About</Link>
      <Link className='footer-link-white text-white small'>Contact</Link>
      <Link className='footer-link-white text-white small'>Privacy</Link>
      <Link className='footer-link-white text-white small'>Terms</Link>
      <Link className='footer-link-white text-white small'>
        <img src={instagram_icon_white} alt='instagram icon'/>
      </Link>
      <Link className='footer-link-white text-white small'>
        <img src={facebook_icon_white} alt='facebook icon'/>
      </Link>
      <Link className='footer-link-white text-white small'>
        <img src={twitter_icon_white} alt='twitter icon'/>
      </Link>
      
     </div>
    </div>
  )
}

export default FooterAuth;