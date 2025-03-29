import {WEATHER_API_KEY} from "../utils/api-keys";

export async function fetchWeather(city: string): Promise<any> {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${WEATHER_API_KEY}`);
        if (!response.ok) throw new Error("City not found");
        return await response.json();
    } catch (error) {
        throw new Error("Unable to fetch weather data");
    }
}
