import React, { useEffect, useState } from "react";
import { MapContainer, Popup, TileLayer, Marker } from "react-leaflet";
import { Link } from "react-router-dom";

import { API_URL } from './App.js';
import Spinner from './Spinner.js';
import './Home.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import conductorIcon from './images/conductor-marker.png';

let ConductorIcon = L.icon({
    iconUrl: conductorIcon,
    shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


function Home(props) {
  console.log('p', props, props.coords ? props.coords : [ 55.1669436, 10.159926]);
  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/api/v1/reports`);
      const json = await res.json();
      setStops(json);
    })();
  }, []);
  const [stops, setStops] = useState([]);
  return (
    <>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href='/cc'>con<sup>2</sup></a>
          <form className="d-flex">
            <button type="button" className="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Invite friend!
            </button>
            <Link to="report" className="btn btn-outline-danger" href="#" role="button">Report?</Link>
          </form>
        </div>
      </nav>
      <div className="modal" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Terms</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Want to help us spread the word? Awesome!</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Invite</button>
            </div>
          </div>
        </div>
      </div>
      {
        props.coords
          ? <MapContainer center={props.coords ? props.coords : [ 55.1669436, 10.159926]} zoom={13}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {
                stops.map((stop, i) => (
                  <Marker key={i} position={[stop.lat, stop.lng]} icon={ConductorIcon}>
                    <Popup maxWidth="100" maxHeight="auto">
                      <img src={stop.image} alt="Conductor" />
                    </Popup>
                  </Marker>
                ))
              }
              <Marker position={props.coords}>
                <Popup maxWidth="200" maxHeight="auto">
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          : <div className="d-flex justify-content-center mt-5 pt-5">
              <Spinner />
            </div>
      }
    </>
  );
};

export default Home;
