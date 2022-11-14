import React from "react";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="text-light text-center mt-4">
      <Link className="text-light text-decoration-none" to="/about">About</Link>
      { " · " }
      <a className="text-light text-decoration-none" href="https://github.com/s1gtrap/con2">GitHub</a>
    </div>
  );
}

export default Footer;
