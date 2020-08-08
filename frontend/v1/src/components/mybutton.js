import React from 'react';
import './mybutton.css';

export default function mybutton(props) {
    return (
        <button
          className="mybutton"
          style={props.buttonStyle}
          onClick={props.func}>{props.label}</button>
      )
  }
