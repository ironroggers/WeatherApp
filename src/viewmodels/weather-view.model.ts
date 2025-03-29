import { makeAutoObservable, runInAction } from "mobx";
import { fetchWeather } from "../services/weatherService";
import { saveWeatherData, getWeatherData, getSearchedCities } from "../utils/storage";
import { WeatherData } from "../models/weather";
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export class WeatherViewModel {
    weatherData: WeatherData | null = null;
    error: string | null = null;
    loading: boolean = false;
    refreshing: boolean = false;
    searchedCities: string[] = [];
    isOffline: boolean = false;
    currentCity: string = '';

    constructor() {
        makeAutoObservable(this);
        this.initializeNetworkListener();
        this.loadSearchedCities();
    }

    private async initializeNetworkListener() {
        const netInfo = await NetInfo.fetch();
        runInAction(() => {
            this.isOffline = !netInfo.isConnected;
        });

        NetInfo.addEventListener(state => {
            runInAction(() => {
                this.isOffline = !state.isConnected;
            });
        });
    }

    async loadSearchedCities() {
        const cities = await getSearchedCities();
        runInAction(() => {
            this.searchedCities = cities;
        });
    }

    async fetchCityWeather(city: string) {
        this.setLoading(true);
        this.currentCity = city;
        this.weatherData = null;
        this.error = null;

        try {
            if (this.isOffline) {
                const cachedData = await getWeatherData(city);
                if (cachedData) {
                    runInAction(() => {
                        this.weatherData = this.transformWeatherData(cachedData);
                    });
                } else {
                    console.log("Unable to fetch this data at the moment");
                }
                return;
            }

            // Online mode
            const data = await fetchWeather(city);
            if (!data) {
                throw new Error("Unable to find the city");
            }

            runInAction(() => {
                this.weatherData = this.transformWeatherData(data);
            });
            await saveWeatherData(city, data);

        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : "Failed to load weather data";
                Alert.alert("Error", this.error);
            });
        } finally {
            runInAction(() => {
                this.loading = false;
                this.refreshing = false;
            });
        }
    }

    clearWeatherData() {
        this.weatherData = null;
        this.error = null;
        this.currentCity = '';
    }

    setLoading(value: boolean) {
        this.loading = value;
    }

    setRefreshing(value: boolean) {
        this.refreshing = value;
    }

    private transformWeatherData(data: any): WeatherData {
        return {
            temperature: data.currentConditions.temp,
            humidity: data.currentConditions.humidity,
            windSpeed: data.currentConditions.windspeed,
            condition: data.currentConditions.conditions,
            location: data.resolvedAddress,
            lastUpdated: new Date().toISOString()
        };
    }
}

export const weatherViewModel = new WeatherViewModel();
