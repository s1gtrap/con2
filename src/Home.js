import React from 'react';
import { Link } from 'react-router-dom';

import Footer from './Footer';

function Home() {
  return (
    <>
      <Link to="signup" className="btn btn-lg btn-light">Sign Up</Link>
      <Footer />
    </>
  );
}

export default Home;
