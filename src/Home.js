import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container d-grid vh-100">
      <div className="row justify-content-center align-self-center m-1">
        <button type="button" className="btn btn-lg btn-light mb-3">Sign Up</button>
        <div className="text-center">
          <Link className="text-body text-decoration-none" to="/about">About</Link>
        </div>
      </div>
    </div>
  )
}

export default Home;
