import React, { Component } from 'react'; 
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import logo from '../images/logo.png'

import "./Navbar.css";

export default class Navbar extends Component { 
  state = {
    isOpen: false
  };

  handleToggle = () => { 
    this.setState({ isOpen: !this.state.isOpen })
  };

  render () {
    return (
      <nav className={this.state.isOpen ? "navbar active" : "navbar"} id="#fullhome">
        <div className="nav-container">
          <HashLink smooth to="#fullhome" className="nav-logo">
            <img className="nav__imgLogo" src={logo} alt="GATB Logo"/>
          </HashLink>

          <ul className={this.state.isOpen ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <HashLink
                smooth
                to="#project"
                className="nav-links"
              >
                ABOUT
              </HashLink>
            </li>
            <li className="nav-item">
              <HashLink
                smooth
                to="#roadmap"
                className="nav-links"
              >
                VISION
              </HashLink>
            </li>
            <li className="nav-item">
              <HashLink
                smooth 
                to="#team"
                className="nav-links"
              >
                FOUNDERS
              </HashLink>
            </li>
            <li className="nav-item">
              <Link className="nav-links" to={{ pathname: "https://twitter.com/BitBotSociety" }} target="_blank" >
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-links" to={{ pathname: "https://discord.com/invite/kG24rk4cMD" }} target="_blank" >
                <FontAwesomeIcon icon={faDiscord} />
              </Link>
            </li>
          </ul>
          <div className="nav-icon" onClick={this.handleToggle}>
            {this.state.isOpen ? <FontAwesomeIcon icon={faTimes} />
              : <FontAwesomeIcon icon={faBars} />
            }
          </div>
        </div>
      </nav>
    );
  }
}