import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

import Footer from './Footer';

function Scan() {
  const [isLoading, setIsLoading] = useState(false);
  //const [invite, setInvite] = useState(false);
  const [code, setCode] = useState(null);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/v1/invite', {
          method: 'post',
          headers: {
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        console.log('data', data);
        setCode(await QRCode.toDataURL(`con2=${data.token}`));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <>
      {
        isLoading
          ? "loading.."
          : <div className="card">
              <div className="card-body">
                <h5 className="card-title">QR Code</h5>
                <p className="card-text">Have your friend scan this code:</p>
                <img src={code} alt="QR code" />
              </div>
            </div>
      }
      <Footer />
    </>
  );
}

export default Scan;
