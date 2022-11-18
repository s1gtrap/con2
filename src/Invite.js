import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

import { fetchJson } from './api';
import Footer from './Footer';
import Spinner from './Spinner';

function Scan() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(null);
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
  return (
    <>
      {
        isLoading
          ? <Spinner />
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
