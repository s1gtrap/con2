import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Footer from './Footer';
import { Permissions } from './Permissions';

type Props = {
  permissions: Permissions,
  showPermissionsPrompt: () => void,
};

function Home({ permissions, showPermissionsPrompt }: Props) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Invite Only</h5>
          <p className="card-text">Sorry, for the time being this application is closed and invite only.</p>
          <p>Have one of your friends send you a link or let you scan their code!</p>
          <Link to="/scan">
            <Button>Scan invite</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
