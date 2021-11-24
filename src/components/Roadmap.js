import React from 'react';
import "./Roadmap.css"

export default function Roadmap () { 
    return (
        <div className="roadmap" id="roadmap">
            <div className="titleWrapper">
                <h1>Giraffe Roadmap</h1>
            </div>
            <div className="wrapper">
                <div className="roadmap__elements">
                    <h2>0% - The Door to the Bar is open!</h2>
                    <p>The Giraffe community begins, our fun-loving Discord has its doors wide open. Come in and say hello!</p>
                </div>
                <div className="roadmap__elements">
                    <h2>25% - Exclusive giveaway opportunities for verified drunken Giraffe owners.</h2>
                </div>
                <div className="roadmap__elements">
                    <h2>50% - Drinks on the Devs!</h2>
                    <p>Unique drinks ranging from fruity cocktails (shaken, not stirred), beers, spirits and unimaginable beverages are made available to lucky Giraffe holders!</p>
                </div>
                <div className="roadmap__elements">
                    <h2>75% - Pangolins on the Plains!</h2>
                    <p>Giraffe holders can claim a cute pangolin to accompany their Giraffe. The goal is to raise awareness and funds for the struggling pangolin population in Africa and Asia. We will donate a portion of funds directly to Pangolin charities.</p>
                </div>
                <div className="roadmap__elements">
                    <h2>100% - The Metaverse awaits…</h2>
                    <p>The moon is the limit... Challenge other Giraffe owners to a drink at the official #GiraffeBar!</p>
                </div>
                
            </div>
        </div>
    );
}