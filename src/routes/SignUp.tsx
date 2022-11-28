import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Card.Title>Invite Only</Card.Title>
      <Card.Text>Sorry, for the time being this application is closed and invite only.</Card.Text>
      <Card.Text>Have one of your friends send you a link or let you scan their code!</Card.Text>
      <Link to="/scan">
        <Button>Scan invite</Button>
      </Link>
    </>
  );
}

export default Home;
