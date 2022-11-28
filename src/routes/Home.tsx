import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { fetchJson } from '../api';
import Spinner from '../Spinner';

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(false);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchJson('/api/v1/me', {
          headers: {
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
        setUser(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (user) {
    return (
      <>
        <Card.Title>Welcome back!</Card.Title>
        <Card.Text>The map is still a work in progress but you can invite your friends for now.</Card.Text>
        <Link to="invite">
          <Button>Invite Friend</Button>
        </Link>
      </>
    );
  } else {
    return (
      <>
        <Card.Title>Con^2</Card.Title>
        <Card.Text>For those of us that enjoy viewing and sharing pictures of bus stops.</Card.Text>
        <Link to="signup">
          <Button>Sign Up</Button>
        </Link>
      </>
    );
  }
}

export default Home;
