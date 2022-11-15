import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import QrReader from 'react-qr-scanner'

import Footer from './Footer';

function Scan() {
  const [scan, setScan] = useState(null);
  const handleScan = (data) => {
    if (data && data.text && data.text.startsWith("con2=")) {
      setScan(data.canvas.toDataURL("image/jpeg"));
    }
  };
  return (
    <>
      {
        localStorage.getItem('permissions')
          ? scan
            ? <img src={scan} alt="QR code scan" />
            : <QrReader
                delay={100}
                onError={console.error.bind(null)}
                onScan={handleScan}
              />
          : <Navigate to="/permissions" replace state="/scan" />
      }
      <Footer />
    </>
  );
}

export default Scan;
