import AsyncStorage from '@react-native-async-storage/async-storage';

// Save weather data to AsyncStorage
export async function saveWeatherData(city: string, data: any): Promise<void> {
    try {
        await AsyncStorage.setItem(`weather_${city}`, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving data to AsyncStorage:", error);
    }
}

// Retrieve weather data from AsyncStorage
export async function getWeatherData(city: string): Promise<any | null> {
    try {
        const data = await AsyncStorage.getItem(`weather_${city}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
        return null;
    }
}
