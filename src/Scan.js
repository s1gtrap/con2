import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import { useMediaDevices } from "react-media-devices";
import { useZxing } from "react-zxing";

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
          const res = await fetch(`/api/v1/invite?token=${encodeURIComponent(secret)}`);
          const data = await res.json();
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
    </>
  );
}

export default Scan;
