import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WeatherConditions } from '../../models/weather';

interface WeatherHeaderProps {
    city: string;
    conditions: WeatherConditions;
    isOffline: boolean;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({ 
    city, 
    conditions, 
    isOffline 
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.locationContainer}>
                    <Feather name="map-pin" size={24} color="#fff" style={styles.locationIcon} />
                    <Text style={styles.location}>{city}</Text>
                </View>
                {isOffline && (
                    <View style={styles.offlineTag}>
                        <Feather name="wifi-off" size={14} color="#fff" />
                        <Text style={styles.offlineText}>Offline</Text>
                    </View>
                )}
            </View>

            <View style={styles.mainWeather}>
                <Text style={styles.temperature}>
                    {Math.round(conditions.temp)}°C
                </Text>
                <Text style={styles.conditions}>
                    {conditions.conditions}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        margin: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        marginRight: 8,
    },
    location: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
    },
    offlineTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    offlineText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 12,
    },
    mainWeather: {
        alignItems: 'center',
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
        textTransform: 'capitalize',
    }
}); 