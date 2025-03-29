export interface WeatherConditions {
    temp: number;
    conditions: string;
    humidity: number;
    windspeed: number;
    visibility: number;
    uvindex: number;
}

export interface ForecastDay {
    datetime: string;
    temp: number;
    conditions: string;
}

export interface WeatherData {
    currentConditions: WeatherConditions;
    days: ForecastDay[];
    resolvedAddress: string;
    lastUpdated: string;
}
