import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

import { fetchAuthJson, fetchNearbyStops, geolocation, Stop } from '../fetch';
import { useAuthContext } from '../App';
import Root from './Root';
import Spinner from '../Spinner';

function Report() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [data, setData] = useState<Stop[] | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [stop, setStop] = useState<Stop | null>(null);
  const [user] = useAuthContext();
  useEffect(() => {
    geolocation().then((p) => setCoords([p.latitude, p.longitude]));
  }, []);
  useEffect(() => {
    console.log('coords', coords)
    if (coords) {
      fetchNearbyStops(coords[0], coords[1])
        .then((data) => setData(data));
    }
  }, [coords]);

  const submit = useCallback(() => {
    fetchAuthJson(user!.token, '/api/v1/reports', {
      method: 'post',
      body: {
        image,
        stopId: stop?.id,
      },
    })
      .then(report => {
        navigate('/map');
      });
  }, [image, navigate, stop, user]);
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      const imageSrc = (webcamRef.current! as Webcam).getScreenshot();
      setImage(imageSrc);
    },
    [webcamRef]
  );

  if (!coords || !data) {
    return <Spinner />;
  }

  if (image) {
    return (
      <div className="container">
        <div className="col">
          <div className="row">
            <p>Please review your submission:</p>
          </div>
          <div className="row">
            <p>{stop!.name}</p>
          </div>
          <div className="row">
            <img alt="Bus stop" src={image} />
          </div>
          <div className="row">
            <Button onClick={submit}>Send it!</Button>
          </div>
        </div>
      </div>
    );
  }

  if (stop) {
    const videoConstraints = {
      facingMode: { exact: "environment" }
    };
    return (
      <div style={{ height: '100vh', display: 'flex', flexFlow: 'column', background: '#000' }} onClick={capture}>
        <Webcam ref={webcamRef} videoConstraints={videoConstraints} style={{ width: '100%', margin: 'auto' }} />
      </div>
    );
  }

  return (
    <Root>
      <>
        <h5>Which bus stop?</h5>
        <ul className="list-group">
          {
            data.map((stop, i) => {
              return (
                <a key={i} href="#a" className="list-group-item list-group-item-action" onClick={() => setStop(stop)}>{stop.name}</a>
              );
            })
          }
        </ul>
      </>
    </Root>
  );
}

export default Report;
