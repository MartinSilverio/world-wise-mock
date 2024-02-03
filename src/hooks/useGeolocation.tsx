import { useState } from 'react';

export function useGeolocation(defaultPosition = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [position, setPosition] = useState<{ lat?: number; lng?: number }>(
        defaultPosition
    );

    function getPosition() {
        if (!navigator.geolocation)
            return setError('Your browser does not support geolocation');

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setIsLoading(false);
            },
            (error) => {
                setError(error.message);
                setIsLoading(false);
            }
        );
    }

    return { isLoading, error, position, getPosition };
}
