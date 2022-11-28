import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useZxing } from "react-zxing";

import { fetchJson } from '../api';

function Scan() {
  const [secret, setSecret] = useState<string | null>(null);
  const [invite, setInvite] = useState(null);
  const navigate = useNavigate();
  const { ref } = useZxing({
    onResult(result) {
      if (!secret && result.getText().startsWith('con2=')) { // FIXME: should this really be necessary?
        const secret = result.getText().slice('con2='.length)
        console.log('secret', secret);
        setSecret(secret);

        (async () => {
          const data = await fetchJson(`/api/v1/invite?token=${encodeURIComponent(secret)}`);
          console.log(data);
          setInvite(data);
        })();
      }
    },
  });

  const onClickClaim = async () => {
    const data = await fetchJson('/api/v1/token', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        token: secret,
      }),
    });
    console.log(data);
    localStorage.setItem('accessToken', data.token);
    navigate('/');
  };

  return (
    <>
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
      <video ref={ref} />
    </>
  );
}

export default Scan;
