import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

function Map() {
    const { cities } = useCities();
    const [mapPosition, setMapPosition] = useState<LatLngExpression>([40, 0]);
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
    } = useGeolocation();

    const [mapLat, mapLng] = useUrlPosition();

    /*
        This useEffect is used to connect changes to query params in url to mapPosition
        Which triggers re-render of ChangeCenter, which will set the view to the mapPosition
        If query params are null (ie we go back in history), it does not set position, 
        so it retains the mapPosition previously selected
    */
    useEffect(
        function () {
            if (mapLat && mapLng)
                setMapPosition([Number(mapLat), Number(mapLng)]);
        },
        [mapLat, mapLng]
    );

    useEffect(
        function () {
            console.log(geolocationPosition);

            if (geolocationPosition?.lat && geolocationPosition?.lng)
                setMapPosition([
                    geolocationPosition.lat,
                    geolocationPosition.lng,
                ]);
        },
        [geolocationPosition]
    );

    return (
        <div className={styles.mapContainer}>
            {!Object.keys(geolocationPosition).length && (
                <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? 'Loading...' : 'Use your position'}
                </Button>
            )}
            <MapContainer
                center={mapPosition}
                zoom={13}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />

                {cities.map((city) => {
                    const { lat, lng } = city.position;

                    return (
                        <Marker position={[lat, lng]} key={city.id}>
                            <Popup>
                                <span>{city.emoji}</span>
                                <span>{city.cityName}</span>
                            </Popup>
                        </Marker>
                    );
                })}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }: { position: LatLngExpression }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: (e) => {
            console.log(e);
            navigate(`form/?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
        },
    });
    return null;
}

export default Map;
