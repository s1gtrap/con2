import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

import { fetchJson } from '../api';
import Spinner from '../Spinner';
import { Card } from 'react-bootstrap';

function Scan() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchJson('/api/v1/invite', {
          method: 'post',
          headers: {
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
        setCode(await QRCode.toDataURL(`con2=${data.token}`));
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

  return (
    <>
      <Card.Title>QR Code</Card.Title>
      <Card.Text>Have your friend scan this code:</Card.Text>
      <img src={code} alt="QR code" />
    </>
  );
}

export default Scan;
