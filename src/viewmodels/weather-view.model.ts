import { makeAutoObservable } from "mobx";
import { fetchWeather } from "../services/weatherService";
import { saveWeatherData, getWeatherData } from "../utils/storage";

class WeatherViewModel {
    weatherData: any = null;
    error: string | null = null;
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchCityWeather(city: string) {
        this.loading = true;
        try {
            // Try to get cached data first
            const cachedData = await getWeatherData(city);
            if (cachedData) {
                this.weatherData = cachedData;
                console.log("Loaded from cache");
            }

            // Fetch from API
            const data = await fetchWeather(city);
            this.weatherData = data;
            this.error = null;

            // Cache the result
            await saveWeatherData(city, data);
        } catch (err) {
            this.error = "Failed to load weather data";
        } finally {
            this.loading = false;
        }
    }
}

export const weatherViewModel = new WeatherViewModel();
