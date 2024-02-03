import { CityType, CountryType } from '../types/types';
import Message from './Message';
import Spinner from './Spinner';
import styles from './CountryList.module.css';
import CountryItem from './CountryItem';
import { useCities } from '../contexts/CitiesContext';

function CountryList() {
    const { cities, isLoading } = useCities();

    if (isLoading) return <Spinner />;
    if (!cities.length)
        return (
            <Message
                message={'Add your first city by clicking on a city on the map'}
            />
        );

    const countries: CountryType[] = cities.reduce(
        (arr: CountryType[], city: CityType) => {
            if (!arr.map((city) => city.country).includes(city.country)) {
                return [...arr, { country: city.country, emoji: city.emoji }];
            }

            return arr;
        },
        new Array<CountryType>()
    );

    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem country={country} key={country.country} />
            ))}
        </ul>
    );
}

export default CountryList;
