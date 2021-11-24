import React from 'react';
import "./Display.css";
import a from '../images/1.png';
import b from '../images/2.png';
import c from '../images/3.png';
import d from '../images/4.png';
import e from '../images/5.png';
import f from '../images/6.png';
import g from '../images/7.png';
import h from '../images/8.png';

export default function Display () {
    return (
        <div className="display__wrapper" id="roadmap">
            <div className="display">
                <h1>Vision for the Community and Future</h1>
                <p>We lowered gas for everyone so we can all beep boop into the metaverse! #BeepboopBitbot</p>
                <div className="display__container">
                    <div className="display__individual">
                        <img src={a} alt="bitbot example"/>
                    </div>
                    <div className="display__individual">
                        <img src={b} alt="bitbot example" />
                    </div>
                    <div className="display__individual">
                        <img src={c} alt="bitbot example" />
                    </div>
                    <div className="display__individual">
                        <img src={d} alt="bitbot example" />
                    </div>
                    <div className="display__individual">
                        <img src={e} alt="bitbot example" />
                    </div>
                    <div className="display__individual">
                        <img src={f} alt="bitbot example" />
                    </div>
                </div>
            </div>  
        </div>
    );
}