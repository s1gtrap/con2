import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

import Spinner from '../Spinner';

function Map() {
    const [isLoading, setIsLoading] = useState(true);
    const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    setCoords(position.coords);
                    setIsLoading(false);
                },
                () => {
                    setIsLoading(false);
                }
            );
        } else {
            // TODO: error reporting
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="ratio ratio-4x3">
            <MapContainer center={[coords?.latitude || 51.505, coords?.longitude || -0.09]} zoom={13} scrollWheelZoom={true} style={{ height: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}

export default Map;