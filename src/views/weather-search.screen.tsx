import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { WEATHER_API_KEY } from '../utils/api-keys';

const WeatherScreen = ({ route }: any) => {
    const { city } = route.params;
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchWeather = async () => {
        try {
            const response = await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${WEATHER_API_KEY}`
            );
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [city]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchWeather();
    }, [city]);

    if (loading) {
        return (
            <LinearGradient 
                colors={['#4c669f', '#3b5998', '#192f6a']} 
                style={styles.loadingContainer}
            >
                <ActivityIndicator size="large" color="#fff" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient 
            colors={['#4c669f', '#3b5998', '#192f6a']} 
            style={styles.container}
        >
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#ffffff"
                        titleColor="#ffffff"
                        colors={['#ffffff']}
                        progressBackgroundColor="#4c669f"
                    />
                }
            >
                {weatherData ? (
                    <View style={styles.content}>
                        <Text style={styles.location}>{weatherData.resolvedAddress}</Text>
                        
                        <View style={styles.mainWeather}>
                            <Text style={styles.temperature}>
                                {Math.round(weatherData.currentConditions.temp)}°C
                            </Text>
                            <Text style={styles.conditions}>
                                {weatherData.currentConditions.conditions}
                            </Text>
                        </View>

                        <View style={styles.detailsContainer}>
                            <View style={styles.detailItem}>
                                <Feather name="droplet" size={24} color="#fff" />
                                <Text style={styles.detailText}>
                                    Humidity
                                </Text>
                                <Text style={styles.detailValue}>
                                    {weatherData.currentConditions.humidity}%
                                </Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Feather name="wind" size={24} color="#fff" />
                                <Text style={styles.detailText}>
                                    Wind Speed
                                </Text>
                                <Text style={styles.detailValue}>
                                    {weatherData.currentConditions.windspeed} km/h
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.errorText}>No data found for "{city}"</Text>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    location: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    mainWeather: {
        alignItems: 'center',
        marginBottom: 40,
    },
    temperature: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#fff',
    },
    conditions: {
        fontSize: 24,
        color: '#fff',
        opacity: 0.9,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 20,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 8,
    },
    detailValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default WeatherScreen;
