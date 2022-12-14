import React, { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuthContext } from '../App';

function Home() {
  const [user] = useAuthContext();
  if (user?.id) {
    return (
      <>
        <Card.Title>Con^2</Card.Title>
        <Card.Text>Welcome back!</Card.Text>
        <Card.Text>The map is still a work in progress but you can invite your friends for now.</Card.Text>
        <Link to="invite">
          <Button>Invite Friend</Button>
        </Link>
        <Link to="/map">
          <Button variant="secondary ms-1">View Map</Button>
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
