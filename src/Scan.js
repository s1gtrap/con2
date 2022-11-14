import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Footer from './Footer';

function Scan() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('permissions')) {
    } else {
      navigate('/permissions', { state: '/scan' });
    }
  });
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Camera</h5>
          <p className="card-text">TODO</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Scan;
