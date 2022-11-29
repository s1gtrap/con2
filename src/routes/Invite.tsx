import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

import { Token, UProps } from '../App';
import { Card } from 'react-bootstrap';

export type Invite = {
  token: string,
};

function Scan({ fetchAuthJson }: UProps) {
  const [code, setCode] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const data: Token = await fetchAuthJson('/api/v1/invite', {
          method: 'post',
        });
        setCode(await QRCode.toDataURL(`con2=${data.token}`));
      } catch (e) {
        console.error(e);
      } finally {
      }
    })();
  }, [fetchAuthJson]);

  return (
    <>
      <Card.Title>QR Code</Card.Title>
      <Card.Text>Have your friend scan this code:</Card.Text>
      <img src={code} alt="QR code" />
    </>
  );
}

export default Scan;
