import {CONFIG} from "../config/env";


export async function fetchWeather(city: string): Promise<any> {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${CONFIG.WEATHER_API_KEY}`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Unable to find the city");
            }
            throw new Error("Unable to fetch weather data");
        }
        
        const data = await response.json();
        if (!data || !data.currentConditions) {
            throw new Error("Unable to find the city");
        }
        
        return data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Unable to fetch weather data");
    }
}
