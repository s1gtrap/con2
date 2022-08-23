import PropTypes from 'prop-types'
import React, { useState } from "react";

import logo from './logo.svg';
import './App.css';
import Webcam from "react-webcam";

function Camera(props) {
  const [pic, setPic] = useState(null);

  const videoConstraints = {
    facingMode: "environment",
  };

  return (
    <div className="col">
      <div className="row">
        <div className="text-center">please take a picture!</div>
      </div>
      <div className="row">
        <Webcam videoConstraints={videoConstraints} style={{maxHeight: '100vh', width: '100%'}}>
          {
            ({ getScreenshot }) => (
              <div style={{position: 'relative', top: '-100px'}} className="btn btn-primary" onClick={() => props.cb(getScreenshot())}>
                Snap
              </div>
            )
          }
        </Webcam>
      </div>
      <div className="row">
      </div>
    </div>
  );
}

Camera.propTypes = {
  cb: PropTypes.func.isRequired,
}

export default Camera;
