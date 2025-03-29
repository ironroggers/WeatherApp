import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const SEARCHED_CITIES_KEY = 'searched_cities';
const CACHE_EXPIRY_HOURS = 24;

// Save weather data to AsyncStorage
export async function saveWeatherData(city: string, data: any): Promise<void> {
    try {
        const normalizedCity = city.toLowerCase().trim();
        await AsyncStorage.setItem(`weather_${normalizedCity}`, JSON.stringify({
            data,
            cachedAt: new Date().toISOString()
        }));
        await addToSearchedCities(normalizedCity);
    } catch (error) {
        console.error("Error saving data to AsyncStorage:", error);
        Alert.alert("Storage Error", "Failed to save weather data");
    }
}

// Retrieve weather data from AsyncStorage
export async function getWeatherData(city: string): Promise<any | null> {
    try {
        const normalizedCity = city.toLowerCase().trim();
        const data = await AsyncStorage.getItem(`weather_${normalizedCity}`);
        if (!data) return null;

        const { data: weatherData, cachedAt } = JSON.parse(data);
        const hoursDiff = (new Date().getTime() - new Date(cachedAt).getTime()) / (1000 * 60 * 60);

        if (hoursDiff > CACHE_EXPIRY_HOURS) {
            await AsyncStorage.removeItem(`weather_${normalizedCity}`);
            return null;
        }

        return weatherData;
    } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
        return null;
    }
}

export async function getSearchedCities(): Promise<string[]> {
    try {
        const cities = await AsyncStorage.getItem(SEARCHED_CITIES_KEY);
        return cities ? JSON.parse(cities) : [];
    } catch (error) {
        console.error("Error getting searched cities:", error);
        return [];
    }
}

export async function addToSearchedCities(city: string): Promise<void> {
    try {
        const normalizedCity = city.toLowerCase().trim();
        const existingCities = await getSearchedCities();
        const updatedCities = [normalizedCity, ...existingCities.filter(c => c !== normalizedCity)].slice(0, 5);
        await AsyncStorage.setItem(SEARCHED_CITIES_KEY, JSON.stringify(updatedCities));
    } catch (error) {
        console.error("Error updating searched cities:", error);
    }
}

export async function hasCachedWeatherData(city: string): Promise<boolean> {
    const data = await getWeatherData(city);
    return data !== null;
}
