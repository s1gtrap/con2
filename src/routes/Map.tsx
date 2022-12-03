import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

import { useAuthContext } from '../App';
import Spinner from '../Spinner';

function geolocation(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => resolve(position.coords),
            reject,
        );
    });
}

function fetchReports(token: string) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => resolve(position.coords),
            reject,
        );
    });
}

function Map() {
    const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
    //const [reports, setReports] = useState<Report | null>(null);
    const [user] = useAuthContext();

    useEffect(() => {
        Promise.all([geolocation(), fetchReports(user!.token)])
            .then(([coords, reports]) => {
                setCoords(coords);
            });
    }, [coords, user]);

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
                </MapContainer>
            </div>
        </div >
    );

}

export default Map;