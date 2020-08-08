import React from 'react';
import './lockStrike.css';
export default function strikeLock(props) {
    return(
        <div className="container">
            <span className={props.unlock?"unlocked":"lock"}></span>
            <span id="propname" className={props.nostrike?"nostrike":"strike"}>{props.name}</span>
        </div>        
    )
  }
