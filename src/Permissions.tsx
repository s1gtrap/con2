import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Footer from './Footer';

function Scan() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [permissions, setPermissions] = useState(localStorage.getItem('permissions') || false);
  const [accessToken, setSessionTokens] = useState(localStorage.getItem('accessToken') || false);
  const [geolocation, setGeolocation] = useState(localStorage.getItem('geolocation') || false);
  const submit = () => {
    localStorage.setItem('permissions', permissions.toString());
    localStorage.setItem('accessToken', accessToken.toString());
    localStorage.setItem('geolocation', geolocation.toString());
    navigate(state);
  };
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Hold Up!</h5>
          <p className="card-text">This application needs permission to scan an invite.</p>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="permissions" disabled={disabled} checked={!!permissions} onChange={(e) => setPermissions(e.target.checked)} />
            <label className="form-check-label" htmlFor="permissions">
              Allow us to use local storage to store permissions granted to avoid asking you again.
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="accessToken" disabled={disabled} checked={!!accessToken} onChange={(e) => setSessionTokens(e.target.checked)} />
            <label className="form-check-label" htmlFor="accessToken">
              Allow us to use local storage to store session tokens to let you stay authenticated.
            </label>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="geolocation" disabled={disabled} checked={!!geolocation} onChange={(e) => setGeolocation(e.target.checked)} />
            <label className="form-check-label" htmlFor="geolocation">
              Allow us access to your geolocation to show nearby conductors and stops.
            </label>
          </div>
          <button className="btn btn-secondary">Reject All</button>
          <button className="btn btn-secondary ms-1" onClick={(e) => {
            setDisabled(true);
            setTimeout(submit, 500);
          }}>Accept Selected</button>
          <button className="btn btn-primary ms-1" onClick={(e) => {
            setDisabled(true);
            setPermissions(true);
            setSessionTokens(true);
            setGeolocation(true);
            setTimeout(submit, 500);
          }}>Accept All</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Scan;
