import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ForecastDay } from '../../models/weather';

interface WeatherForecastProps {
    days: ForecastDay[];
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ days }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getWeatherIcon = (conditions: string): string => {
        const condition = conditions.toLowerCase();
        if (condition.includes('rain')) return 'cloud-rain';
        if (condition.includes('cloud')) return 'cloud';
        if (condition.includes('snow')) return 'cloud-snow';
        if (condition.includes('thunder')) return 'cloud-lightning';
        if (condition.includes('clear')) return 'sun';
        return 'cloud';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>5-Day Forecast</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
            >
                {days.slice(1, 6).map((day, index) => (
                    <View 
                        key={`${day.datetime}-${index}`} 
                        style={styles.forecastDay}
                    >
                        <Text style={styles.date}>
                            {formatDate(day.datetime)}
                        </Text>
                        <Feather 
                            name={getWeatherIcon(day.conditions)} 
                            size={24} 
                            color="#fff" 
                            style={styles.icon}
                        />
                        <Text style={styles.temperature}>
                            {Math.round(day.temp)}°C
                        </Text>
                        <Text style={styles.conditions}>
                            {day.conditions}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    scrollView: {
        marginHorizontal: -5,
    },
    forecastDay: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 5,
        alignItems: 'center',
        minWidth: 100,
    },
    date: {
        color: '#fff',
        opacity: 0.7,
        marginBottom: 8,
        fontSize: 14,
    },
    icon: {
        marginVertical: 8,
    },
    temperature: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 4,
    },
    conditions: {
        color: '#fff',
        opacity: 0.8,
        fontSize: 14,
        textAlign: 'center',
    }
}); 