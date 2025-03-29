import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WeatherConditions } from '../../models/weather';
import { DetailItem } from './DetailItem';

interface WeatherDetailsProps {
    conditions: WeatherConditions;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ conditions }) => {
    return (
        <View style={styles.container}>
            <DetailItem 
                icon="droplet" 
                label="Humidity" 
                value={`${conditions.humidity}%`} 
            />
            <DetailItem 
                icon="wind" 
                label="Wind" 
                value={`${Math.round(conditions.windspeed)} km/h`} 
            />
            <DetailItem 
                icon="sun" 
                label="UV Index" 
                value={conditions.uvindex?.toString() || 'N/A'} 
            />
            <DetailItem 
                icon="eye" 
                label="Visibility" 
                value={`${conditions.visibility || 'N/A'} km`} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 15,
    }
}); 