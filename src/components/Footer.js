import React, { Component } from 'react'; 
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import logo from '../images/logo.png'

import "./Footer.css";

export default class Footer extends Component { 
  render () {
    return (
      <nav className="footer">
        <div className="footer-container">
          <HashLink smooth to="#home" className="footer-logo">
            <img src={logo} alt="bitbot logo"/>
          </HashLink>

          <div className="footer__space"/>

          <ul className="footer-menu">
            <li className="footer-item">
              <Link className="footer-links" to={{ pathname: "https://twitter.com/BitBotSociety" }} target="_blank" >
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </li>
            <li className="footer-item">
              <Link className="footer-links" to={{ pathname: "https://discord.com/invite/kG24rk4cMD" }} target="_blank" >
                <FontAwesomeIcon icon={faDiscord} />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}