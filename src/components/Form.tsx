// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { FormEvent, useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Message from './Message';
import Spinner from './Spinner';
import { CityType } from '../types/types';
import { useCities } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

function convertToEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
    const [cityName, setCityName] = useState('');
    const [country, setCountry] = useState('');
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [lat, lng] = useUrlPosition();
    const [isLoadingGeocoding, setIsLoadingGeoCoding] = useState(false);
    const [emoji, setEmoji] = useState('');
    const [geoCodingError, setGeoCodingError] = useState('');
    const { createCity, isLoading } = useCities();
    const navigate = useNavigate();

    useEffect(
        function () {
            if (!lat && !lng) return;
            (async () => {
                try {
                    setIsLoadingGeoCoding(true);
                    setGeoCodingError('');
                    const res = await fetch(
                        `${BASE_URL}?latitude=${lat}&longitude=${lng}`
                    );
                    const data = await res.json();
                    console.log(data);

                    if (!data.countryCode)
                        throw new Error(
                            "That doesn't seem to be a city. Please click somewhere else"
                        );

                    setCityName(data.city || data.locality || '');
                    setCountry(data.countryName);
                    setEmoji(convertToEmoji(data.countryCode));
                } catch (e) {
                    if (e instanceof Error) {
                        setGeoCodingError(e.message);
                    }
                } finally {
                    setIsLoadingGeoCoding(false);
                }
            })();
        },
        [lat, lng]
    );

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!cityName || !date || !lat || !lng) return;

        const newCity: CityType = {
            cityName,
            country,
            emoji,
            notes,
            date: date.toDateString(),
            position: {
                lat: Number(lat),
                lng: Number(lng),
            },
        };
        console.log(newCity);
        await createCity?.(newCity);
        navigate('/app');
    }

    if (!lat && !lng)
        return <Message message={'Start by clicking on the map'} />;
    if (isLoadingGeocoding) return <Spinner />;
    if (geoCodingError) return <Message message={geoCodingError} />;

    return (
        <form
            className={`${styles.form} ${isLoading ? styles.loading : ''}`}
            onSubmit={handleSubmit}
        >
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
                <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker
                    id="date"
                    onChange={(date) => setDate(date || new Date())}
                    selected={date}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>
                <BackButton />
            </div>
        </form>
    );
}

export default Form;
