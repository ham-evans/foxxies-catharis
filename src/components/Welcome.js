import React from 'react';
import "./Welcome.css";
import welcomeGif from '../images/welcomeGif.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Link } from "react-router-dom";

export default function Welcome () {
    return (
        <div className="welcome" id="Welcome">
            <div className="welcome__container">
                <h1>Welcome to Bit Bot Society</h1> 
                <p>Bots don’t use roadmaps, they are programmed with GPS to beep boop directly into the Metaverse!</p>
                <button className="welcome__button"><a href="https://opensea.io/collection/bit-bot-society" target="_blank" rel="noreferrer" className="welcome__link">Bit Bot Opensea</a></button>
                <div className="welcome-linksWrapper">
                    <Link className="welcome-links" to={{ pathname: "https://twitter.com/BitBotSociety" }} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faTwitter} />
                    </Link>
                    <Link className="welcome-links" to={{ pathname: "https://discord.com/invite/kG24rk4cMD" }} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faDiscord} />
                    </Link>
                </div>
            </div>
            <div className="welcome__imgContainer">
                <img src={welcomeGif} alt="Giraffe Gif"/>
            </div>
        </div>
    
    );
}
