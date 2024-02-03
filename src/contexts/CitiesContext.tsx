import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import { CityType } from '../types/types';

interface CitiesContextType {
    cities: CityType[];
    isLoading: boolean;
    currentCity?: CityType;
    error: string;
    getCity?: (id: number) => void;
    createCity?: (city: CityType) => void;
    deleteCity?: (id: number) => void;
}

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext<CitiesContextType>({
    cities: [],
    isLoading: false,
    error: '',
});

interface CityState {
    cities: CityType[];
    isLoading: boolean;
    currentCity: CityType | undefined;
    error: string;
}

interface ActionLoading {
    type: 'loading';
}

interface ActionCitiesLoaded {
    type: 'cities/loaded';
    payload: CityType[];
}

interface ActionCityLoaded {
    type: 'city/loaded';
    payload: CityType;
}

interface ActionCreated {
    type: 'city/created';
    payload: CityType;
}

interface ActionDeleted {
    type: 'city/deleted';
    payload: number;
}

interface ActionRejected {
    type: 'rejected';
    payload: string;
}

type CityActions =
    | ActionLoading
    | ActionCitiesLoaded
    | ActionCityLoaded
    | ActionCreated
    | ActionDeleted
    | ActionRejected;

const initialState: CityState = {
    cities: [],
    isLoading: false,
    currentCity: undefined,
    error: '',
};

function reducer(state: CityState, action: CityActions): CityState {
    switch (action.type) {
        case 'loading':
            return { ...state, isLoading: true, error: '' };
        case 'cities/loaded':
            return { ...state, isLoading: false, cities: action.payload };
        case 'city/loaded':
            return { ...state, isLoading: false, currentCity: action.payload };
        case 'city/created':
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
            };
        case 'city/deleted':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter(
                    (city) => city?.id !== action.payload
                ),
                currentCity:
                    state.currentCity?.id === action.payload
                        ? undefined
                        : state.currentCity,
            };
        case 'rejected':
            return { ...state, isLoading: false, error: action.payload };
    }
}

export function CitiesProvider({ children }: { children: ReactNode }) {
    // const [cities, setCities] = useState<CityType[]>([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState<CityType>();
    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
        reducer,
        initialState
    );

    //Don't derive countryList from here, because we should only calculate it on the Component it renders on

    useEffect(function () {
        (async () => {
            try {
                dispatch({ type: 'loading' });
                const resp = await fetch(`${BASE_URL}/cities`);
                const data = await resp.json();
                console.log(data);
                dispatch({ type: 'cities/loaded', payload: data });
            } catch (error) {
                dispatch({
                    type: 'rejected',
                    payload: `There was an error loading cities`,
                });
            }
        })();
    }, []);

    async function getCity(id: number) {
        if (id === currentCity?.id) return;

        try {
            dispatch({ type: 'loading' });
            const resp = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await resp.json();
            console.log(data);
            dispatch({ type: 'city/loaded', payload: data });
        } catch (error) {
            dispatch({
                type: 'rejected',
                payload: `There was an error getting current city`,
            });
        }
    }
    async function createCity(newCity: CityType) {
        try {
            dispatch({ type: 'loading' });
            const resp = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await resp.json();
            console.log(data);
            dispatch({ type: 'city/created', payload: data });
        } catch (error) {
            dispatch({
                type: 'rejected',
                payload: `There was an error creating city`,
            });
        }
    }

    async function deleteCity(id: number) {
        try {
            dispatch({ type: 'loading' });
            const resp = await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE',
            });
            const data = await resp.json();
            console.log(data);
            dispatch({ type: 'city/deleted', payload: id });
        } catch (error) {
            dispatch({
                type: 'rejected',
                payload: `There was an error deleting city`,
            });
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                error,
                getCity,
                createCity,
                deleteCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const cities = useContext(CitiesContext);
    if (cities === undefined)
        throw new Error('CitiesContext was used outside of its provider');

    return cities;
}

export { CitiesContext, useCities };
