import React from 'react';
import "./Team.css";
import chris from '../images/CHRIS.png'
import jay from '../images/JAY.png'

export default function Team () {
    return (
        <div className="team" id="team">
            <div className="team__container">
                <h1>Lead BitBots</h1> 
            </div>
            <div className="team__imgContainer">
                <div className="team__imgIndividual">
                    <img src={chris} alt="Bitbot Founders"/>
                    <figcaption className="caption">Chris</figcaption>
                </div>
                <div className="team__imgIndividual">
                    <img src={jay} alt="Bitbot Founders"/>
                    <figcaption className="caption">Jay</figcaption>
                </div>
            </div>
        </div>
    
    );
}
