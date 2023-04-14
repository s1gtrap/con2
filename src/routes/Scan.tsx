import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useZxing } from "react-zxing";

import { fetchJson } from '../fetch';
import { UserToken } from '../App';
import { Invite } from './Invite';

type Props = {
  setAccessToken: (t: string | null) => void,
}
function Scan({ setAccessToken }: Props) {
  const [secret, setSecret] = useState<string | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);
  const navigate = useNavigate();
  const { ref } = useZxing({
    onResult(result) {
      if (!secret && result.getText().startsWith('con2=')) { // FIXME: should this really be necessary?
        const secret = result.getText().slice('con2='.length)
        console.log('secret', secret);
        setSecret(secret);

        (async () => {
          const data = await fetchJson<Invite>(`/api/v1/invite?token=${encodeURIComponent(secret)}`);
          console.log(data);
          setInvite(data);
        })();
      }
    },
    constraints: {
      video: { facingMode: 'environment' }
    },
  });

  const onClickClaim = async () => {
    const data = await fetchJson<UserToken>('/api/v1/token', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: {
        token: secret,
      },
    });
    setAccessToken(data.token);
    navigate('/');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexFlow: 'column', background: '#000' }}>
      <Modal show={!!invite}>
        <Modal.Header onHide={() => setInvite(null)} closeButton>
          <Modal.Title>Checks out!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Valid invite! Do you want to claim it?</p>
          <b>Doing so will invalidate it!</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setInvite(null)}>Cancel</Button>
          <Button variant="primary" onClick={onClickClaim}>Claim</Button>
        </Modal.Footer>
      </Modal>
      <video ref={ref} style={{ width: '100%', margin: 'auto' }} />
    </div>
  );
}

export default Scan;
