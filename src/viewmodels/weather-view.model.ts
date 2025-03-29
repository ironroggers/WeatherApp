import { makeAutoObservable, runInAction } from "mobx";
import { WeatherData } from "../models/weather";
import { fetchWeather } from "../services/weatherService";
import { saveWeatherData, getWeatherData, hasCachedWeatherData } from "../utils/storage";
import NetInfo from '@react-native-community/netinfo';

export class WeatherViewModel {
    weatherData: WeatherData | null = null;
    error: string | null = null;
    loading: boolean = false;
    refreshing: boolean = false;
    isOffline: boolean = false;
    currentCity: string = '';

    constructor() {
        makeAutoObservable(this);
        this.initializeNetworkListener();
    }

    private initializeNetworkListener() {
        NetInfo.addEventListener(state => {
            runInAction(() => {
                this.isOffline = !state.isConnected;
            });
        });
    }

    async hasCachedData(city: string): Promise<boolean> {
        return await hasCachedWeatherData(city);
    }

    async fetchCityWeather(city: string) {
        this.setLoading(true);
        this.error = null;
        this.currentCity = city;

        try {
            let data;
            if (this.isOffline) {
                data = await getWeatherData(city);
                if (!data) throw new Error("No cached data available");
            } else {
                data = await fetchWeather(city);
                await saveWeatherData(city, data);
            }

            runInAction(() => {
                this.weatherData = data;
            });
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : "Failed to load weather data";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
                this.refreshing = false;
            });
        }
    }

    setLoading(value: boolean) {
        this.loading = value;
    }

    setRefreshing(value: boolean) {
        this.refreshing = value;
    }

    clearWeatherData() {
        this.weatherData = null;
        this.error = null;
    }
}

export const weatherViewModel = new WeatherViewModel();
