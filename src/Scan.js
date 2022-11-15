import React, { useState } from 'react';
import { useZxing } from "react-zxing";

import { fetchJson } from './api';
import Footer from './Footer';

function Scan() {
  const [secret, setSecret] = useState(null);
  const [invite, setInvite] = useState(null);
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

  return (
    <>
      {
        !secret && <video ref={ref} />
      }
      {
        invite
          ? <p>claim invite?</p>
          : <p>
              <span>Last result:</span>
              <span>{secret}</span>
            </p>
      }
      <Footer />
    </>
  );
}

export default Scan;
