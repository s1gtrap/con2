import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

import { fetchAuthJson } from '../fetch';
import { Token, useAuthContext } from '../App';

export type Invite = {
  token: string,
};

function Scan() {
  const [user] = useAuthContext();
  const [code, setCode] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const data: Token = await fetchAuthJson(user!.token, '/api/v1/invite', {
          method: 'post',
        });
        setCode(await QRCode.toDataURL(`con2=${data.token}`));
      } catch (e) {
        console.error(e);
      } finally {
      }
    })();
  }, [user]);

  return (
    <>
      <Card.Title>QR Code</Card.Title>
      <Card.Text>Have your friend scan this code:</Card.Text>
      <img src={code} alt="QR code" />
    </>
  );
}

export default Scan;
