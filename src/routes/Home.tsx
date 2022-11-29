import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { User } from '../App';

type Props = {
  user: User | null,
};

function Home({ user }: Props) {
  if (user) {
    return (
      <>
        <Card.Title>Con^2</Card.Title>
        <Card.Text>Welcome back!</Card.Text>
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
