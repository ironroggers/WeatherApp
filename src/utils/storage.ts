import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const SEARCHED_CITIES_KEY = 'searched_cities';
const CACHE_EXPIRY_HOURS = 24;

// Save weather data to AsyncStorage
export async function saveWeatherData(city: string, data: any): Promise<void> {
    try {
        await AsyncStorage.setItem(`weather_${city}`, JSON.stringify({
            ...data,
            cachedAt: new Date().toISOString()
        }));
        await addToSearchedCities(city);
    } catch (error) {
        console.error("Error saving data to AsyncStorage:", error);
        Alert.alert("Storage Error", "Failed to save weather data");
    }
}

// Retrieve weather data from AsyncStorage
export async function getWeatherData(city: string): Promise<any | null> {
    try {
        const data = await AsyncStorage.getItem(`weather_${city}`);
        if (!data) return null;

        const parsedData = JSON.parse(data);
        const cachedAt = new Date(parsedData.cachedAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60);

        if (hoursDiff > CACHE_EXPIRY_HOURS) {
            await AsyncStorage.removeItem(`weather_${city}`);
            return null;
        }

        return parsedData;
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
        console.error("Error retrieving searched cities:", error);
        return [];
    }
}

async function addToSearchedCities(city: string): Promise<void> {
    try {
        const cities = await getSearchedCities();
        if (!cities.includes(city)) {
            cities.push(city);
            await AsyncStorage.setItem(SEARCHED_CITIES_KEY, JSON.stringify(cities));
        }
    } catch (error) {
        console.error("Error adding to searched cities:", error);
    }
}
