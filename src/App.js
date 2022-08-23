import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Camera from "./Camera";
import Error from "./Error";
import Home from "./Home";
import Location from "./Location";
import Report from "./Report";
import Spinner from "./Spinner";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
export const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

function NotFound() {
  return (
    <div className="mt-5 text-center">
      <h1 className="font-monospace">404</h1>
      <p className="lead">Not Found</p>
    </div>
  )
}

function App() {
  const [stage, setStage] = useState(0);
  const [pic, setPic] = useState(null);
  const [stop, setStop] = useState(null);
  //const [status, setStatus] = useState(null);
  const [secret, setSecret] = useState(localStorage.getItem("secret"));
  const [auth, setAuth] = useState(null);

  async function submit(pic, stop) {
    const res = await fetch(`${API_URL}/api/v1/reports`, {
      method: 'post',
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": `Bearer ${secret}`,
      },
      body: JSON.stringify({image: pic, stop}),
    });
    const json = await res.json();
    console.log(stop);
    setStage(0);
  }

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/api/v1/status`, {
        headers: {
          "accept": "application/json",
        },
      });
      const json = await res.json();
      setStatus(json);

      if (window.location.hash.slice(1) !== "") {
        console.log("trying new secret");
        console.log("auth is now");
        const secret = window.location.hash.slice(1);
        console.log("auth is now", secret);
        // got new secret, try it
        const res = await fetch(`${API_URL}/api/v1/me`, {
          headers: {
            "accept": "application/json",
            "authorization": `Bearer ${window.location.hash.slice(1)}`,
          },
        });
        console.log("auth is now", res);
        const json = await res.json();
        console.log("auth is now", json);
        localStorage.setItem("secret", secret);
        setSecret(secret);
        setAuth(json);
        console.log("tring to replace", json);
        window.history.replaceState({}, "/fadf", BASE_URL);
        // success! exit
        return;
      }

      if (secret !== null) {
        console.log("trying saved secret");
        // try to use stored secret
        const res = await fetch(`${API_URL}/api/v1/me`, {
          headers: {
            "accept": "application/json",
            "authorization": `Bearer ${secret}`,
          },
        });
        const json = await res.json();
        setAuth(json);
        console.log("auth2 is now", json);
        // success! exit
        return;
      }


    })();
  }, []);
  async function inviteFriend() {
    const res = await fetch(`${API_URL}/api/v1/invite`, {
      method: 'post',
      headers: {
        'authorization': `Bearer ${secret}`,
      },
    });
    navigator.clipboard.writeText(`${window.location.origin}/verify/${await res.text()}`);
  }

  const [isLoadingMe, setIsLoadingMe] = useState(false);
  const [me, setMe] = useState(null);
  useEffect(() => {
    (async () => {
      setIsLoadingMe(true);
      setMe(null);
      try {
        const res = await fetch(`${API_URL}/api/v1/me`, {
          method: 'get',
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": `Bearer ${secret}`,
          },
        });
        const json = await res.json();
        setMe(json);
      } finally {
        setIsLoadingMe(false);
      }
    })();
  }, []);

  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [status, setStatus] = useState(null);
  useEffect(() => {
    (async () => {
      setIsLoadingStatus(true);
      setStatus(null);
      try {
        const res = await fetch(`${API_URL}/api/v1/status`, {
          method: 'get',
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": `Bearer ${secret}`,
          },
        });
        const json = await res.json();
        setStatus(json);
      } finally {
        setIsLoadingStatus(false);
      }
    })();
  }, []);

  const [isLoadingPerms, setIsLoadingPerms] = useState(true);
  const [permsGeo, setPermsGeo] = useState(null);
  useEffect(() => {
    (async () => {
      const p = await navigator.permissions.query({ name: 'geolocation' });
      setIsLoadingPerms(false);
      if (p === 'prompt') {
        setError("Sorry, but this app needs to know your location...");
      } else if (p === 'denied') {
        setError("Sorry, but this app needs to know your location...");
      } else {
        setPermsGeo(p.state);
        setError(null);
        navigator.geolocation.getCurrentPosition(async (sf) => {
          setCoords([sf.coords.latitude, sf.coords.longitude]);
        }, () => setPermsGeo('denied'), console.log.bind(null));
        console.log(p.state);
      }
    })();
  }, []);

  const [error, setError] = useState(null);

  const [reports, setReports] = useState(null);
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    (async () => {
      /*navigator.geolocation.getCurrentPosition(async (sf) => {
        setCoords([sf.coords.latitude, sf.coords.longitude]);
      }, console.error.bind(null), console.log.bind(null));*/
      const res = await fetch(`${API_URL}/api/v1/reports`, {
        method: 'get',
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "authorization": `Bearer ${secret}`,
        },
      });
      const json = await res.json();
    })();
  }, []);

  return (
    isLoadingStatus || isLoadingMe
      ? <div className="text-center">
          <Spinner />
        </div>
      : status && status.access === 'closed' && !me
          ? <div className="text-center">
              Sorry, 
            </div>
          : isLoadingPerms
              ? <div className="text-center">
                  <Spinner />
                </div>
              : permsGeo === 'denied'
                  ? <Error text={"Sorry, but this app needs to know your location to show you nearby controllers."} />
                  : permsGeo === 'prompt'
                      ? <Error>
                          This app needs to know your location to show you nearby conductors.
                          {" "}
                          <a href="#" onClick={() => {
                            navigator.geolocation.getCurrentPosition(async (sf) => {
                              setPermsGeo('granted');
                              setCoords([sf.coords.latitude, sf.coords.longitude]);
                            }, () => setPermsGeo('denied'), console.log.bind(null));
                          }}>Click here to allow.</a>
                        </Error>
                      : <BrowserRouter>
                          <Routes>
                            <Route path="/tracker" element={<Home coords={coords} />}></Route>
                            <Route path="/tracker/report" element={<Report coords={coords} />}></Route>
                            <Route path="*" element={<NotFound />}></Route>
                          </Routes>
                        </BrowserRouter>
  );
}

export default App;
