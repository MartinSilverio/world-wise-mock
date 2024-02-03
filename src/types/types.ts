export interface CityType {
    cityName: string;
    country: string;
    emoji: string;
    date: string;
    notes: string;
    position: {
        lat: number;
        lng: number;
    };
    id?: number;
}

export interface CountryType {
    country: CityType['country'];
    emoji: CityType['emoji'];
}
