import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//import { API_URL } from './App';
import Camera from './Camera';
import Location from './Location';

function Report() {
  const [pic, setPic] = useState(null);
  const [loc, setLoc] = useState(null);
  //const [secret, setSecret] = useState(localStorage.getItem("secret"));
  const navigate = useNavigate();

  return (
    <>
      {
        loc
          ? <div className="text-center mt-3">
              <p className="lead">Does this look right?</p>
              <p>{loc[0]}</p>
              <img src={pic} alt='Bus conductor' />
              <button className="btn btn-primary" onClick={() => {
                (async () => {
                  /*const res = await fetch(`${API_URL}/api/v1/reports`, {
                    method: 'post',
                    headers: {
                      "accept": "application/json",
                      "content-type": "application/json",
                      "authorization": `Bearer ${secret}`,
                    },
                    body: JSON.stringify({image: pic, stop: loc[1]}),
                  });*/
                  //const json = await res.json();
                  navigate("/tracker");
                })();
              }}>Yes, submit!</button>
            </div>
          : pic
              ? <Location cb={setLoc} />
              : <Camera cb={setPic} />
      }
    </>
  );
}

export default Report;
