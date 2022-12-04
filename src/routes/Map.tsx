import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';

import markerUrl from 'leaflet/dist/images/marker-icon.png';
import markerRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import markerReportUrl from '../images/conductor-marker.png';

import { fetchAuthJson, geolocation } from '../fetch';
import { useAuthContext } from '../App';
import Spinner from '../Spinner';

const iconSelf = new Icon({
  iconUrl: markerUrl,
  iconRetinaUrl: markerRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const iconReport = new Icon({
  iconUrl: markerReportUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

type Report = {
  id: string,
  stop: string,
  image: string,
  name: string,
  lat: number,
  lng: number,
}

function Map() {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [reports, setReports] = useState<Report[] | null>(null);
  const [user] = useAuthContext();

  useEffect(() => {
    Promise.all([geolocation(), fetchAuthJson<Report[]>(user!.token, '/api/v1/reports')])
      .then(([coords, reports]) => {
        setCoords(coords);
        setReports(reports);
      });
  }, [user]);

  if (!coords || !user) {
    return <Spinner />;
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh'
    }}>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container">
          <Link to="/" className="navbar-brand">Con^2</Link>
          <Link to="/report">
            <button className="btn btn-outline-success" type="submit">Submit</button>
          </Link>
        </div>
      </nav >
      <div style={{ flexGrow: 1 }}>
        <MapContainer center={[coords?.latitude || 51.505, coords?.longitude || -0.09]} zoom={13} scrollWheelZoom={true} style={{
          width: '100%', height: '100%'
        }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coords.latitude, coords.longitude]} icon={iconSelf}></Marker>
          {
            reports?.map((report, i) => {
              return (
                <Marker key={i} position={[report.lat, report.lng]} icon={iconReport}>
                  <Popup maxHeight={1000} maxWidth={1000}>
                    <img alt="Bus stop" src={report.image} style={{ width: '50vw' }} />
                  </Popup>
                </Marker>
              );
            })
          }
        </MapContainer>
      </div>
    </div >
  );

}

export default Map;