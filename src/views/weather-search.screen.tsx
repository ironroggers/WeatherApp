import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { weatherViewModel } from '../viewmodels/weather-view.model';

const WeatherScreen = observer(({ route, navigation }: any) => {
    const { city } = route.params;
    const viewModel = weatherViewModel;

    useEffect(() => {
        if (viewModel.isOffline) {
            Alert.alert(
                "Offline Mode",
                "You are currently offline. Showing cached data if available."
            );
        }
        viewModel.fetchCityWeather(city);

        return () => {
            viewModel.clearWeatherData();
        };
    }, [city]);

    const onRefresh = React.useCallback(() => {
        viewModel.setRefreshing(true);
        viewModel.fetchCityWeather(city);
    }, [city]);

    if (viewModel.loading) {
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
                        refreshing={viewModel.refreshing}
                        onRefresh={onRefresh}
                        tintColor="#ffffff"
                        colors={['#ffffff']}
                        progressBackgroundColor="#4c669f"
                    />
                }
            >
                {viewModel.weatherData ? (
                    <View style={styles.content}>
                        <Text style={styles.location}>{viewModel.weatherData.location}</Text>
                        
                        <View style={styles.mainWeather}>
                            <Text style={styles.temperature}>
                                {Math.round(viewModel.weatherData.temperature)}°C
                            </Text>
                            <Text style={styles.conditions}>
                                {viewModel.weatherData.condition}
                            </Text>
                        </View>

                        <View style={styles.detailsContainer}>
                            <View style={styles.detailItem}>
                                <Feather name="droplet" size={24} color="#fff" />
                                <Text style={styles.detailText}>Humidity</Text>
                                <Text style={styles.detailValue}>
                                    {viewModel.weatherData.humidity}%
                                </Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Feather name="wind" size={24} color="#fff" />
                                <Text style={styles.detailText}>Wind Speed</Text>
                                <Text style={styles.detailValue}>
                                    {viewModel.weatherData.windSpeed} km/h
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.errorText}>{viewModel.error || `No data found for "${city}"`}</Text>
                )}
            </ScrollView>
        </LinearGradient>
    );
});

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
