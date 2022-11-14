import React from 'react';
import { Link } from 'react-router-dom';

import Footer from './Footer';

function Home() {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Invite Only</h5>
          <p className="card-text">Sorry, for the time being this application is closed and invite only.</p>
          <p>Have one of your friends send you a link or let you scan their code!</p>
          <Link to="/scan" className="btn btn-primary">Scan invite</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
