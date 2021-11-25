import React, { Component } from 'react'; 
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import logo from '../foxxiesImages/logoWhite.png'

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
              <Link className="nav-links" to={{ pathname: "https://www.catharsisdesign.com/foxxies" }} target="_blank" >
                Back to Main Site
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-links" to={{ pathname: "https://discord.com/invite/UbmwkynKbW" }} target="_blank" >
                <FontAwesomeIcon className="fontAwesome" icon={faDiscord} />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-links" to={{ pathname: "https://twitter.com/catharsisnft" }} target="_blank" >
                <FontAwesomeIcon className="fontAwesome" icon={faTwitter} />
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-links" to={{ pathname: "https://www.instagram.com/catharsisdesigns/" }} target="_blank" >
                <FontAwesomeIcon className="fontAwesome" icon={faInstagram} />
              </Link>
            </li>
            <button>
              <Link className="nav-links" to={{ pathname: "https://opensea.io/collection/catharsis01" }} target="_blank" >
                BUY ON OPENSEA
              </Link>
            </button>
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