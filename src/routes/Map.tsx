import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

import { UProps } from '../App';
import Spinner from '../Spinner';

function geolocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => resolve(position.coords),
            reject,
        );
    });
}

function fetchReports(fetchAuthJson: (r: string, o?: object) => void) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => resolve(position.coords),
            reject,
        );
    });
}

function Map({ fetchAuthJson }: UProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
    //const [reports, setReports] = useState<Report | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const [coords]: any[] = await Promise.all([geolocation(), fetchReports(fetchAuthJson)]);
            setCoords(coords);
            setIsLoading(false);
        })();
    }, [fetchAuthJson]);

    if (isLoading) {
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