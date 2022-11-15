import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from './Footer';

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(false);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/v1/me', {
          headers: {
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        setUser(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <>
      {
        isLoading
          ? "loading.."
          : user
              ? <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Welcome back!</h5>
                    <p className="card-text">The map is still a work in progress but you can invite your friends for now.</p>
                    <Link to="invite" className="btn btn-primary ms-1">Invite Friend</Link>
                  </div>
                </div>
              : <Link to="signup" className="btn btn-lg btn-light">Sign Up</Link>
      }
      <Footer />
    </>
  );
}

export default Home;
