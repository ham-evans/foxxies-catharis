import React from 'react';
import "./Info.css";
import pattern from '../images/star2.jpeg';

export default function Info () {
    return (
        <div className="info" id="info" style={{ backgroundImage: `url(${pattern})` }}>
            <div className="info__container"  >
                <h1>Bit Bot Society Information</h1> 
                <ul>
                    <li>
                        Presale: SOLD OUT
                    </li>
                    <li>
                        Mint will be done in increments!
                    </li>
                    <li>
                        Airdrops to holders as mint proceeds.
                    </li>
                    <li>
                        Total number of Bit Bot NFTs: 9,999
                    </li>
                    <li>
                        Price per NFT: 0.015 ETH + gas (REDUCED GAS)
                    </li>
                    <li>
                        Token type: ERC-721
                    </li>
                    <li>
                        Blockchain: Ethereum
                    </li>
                    <li>
                        Smart contract: <span className="contractAddy">0x68cf439BA5D2897524091Ef81Cb0A3D1F56E5500</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
