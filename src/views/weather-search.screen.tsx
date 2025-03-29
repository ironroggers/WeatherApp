import React, { useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react-lite';
import { weatherViewModel } from '../viewmodels/weather-view.model';
import { WeatherDetails } from "../components/weather/WeatherDetails";
import { ErrorView } from "../components/common/ErrorView";
import { WeatherHeader } from "../components/weather/WeatherHeader";
import { WeatherForecast } from "../components/weather/WeatherForecast";
import { LoadingView } from "../components/common/LoadingView";

const WeatherScreen = observer(({ route, navigation }: any) => {
    const { city } = route.params;
    const viewModel = weatherViewModel;

    useEffect(() => {
        viewModel.fetchCityWeather(city);
        return () => viewModel.clearWeatherData();
    }, [city]);

    if (viewModel.loading) return <LoadingView />;
    if (viewModel.error) return <ErrorView error={viewModel.error} onRetry={() => viewModel.fetchCityWeather(city)} />;
    if (!viewModel.weatherData) return <ErrorView error={`No data found for "${city}"`} />;

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
                        onRefresh={() => viewModel.fetchCityWeather(city)}
                        enabled={!viewModel.isOffline}
                        tintColor="#ffffff"
                    />
                }
            >
                <WeatherHeader 
                    city={city} 
                    conditions={viewModel.weatherData.currentConditions}
                    isOffline={viewModel.isOffline}
                />
                <WeatherDetails conditions={viewModel.weatherData.currentConditions} />
                <WeatherForecast days={viewModel.weatherData.days} />
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
    }
});

export default WeatherScreen;
