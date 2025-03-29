import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const LoadingView: React.FC = () => (
    <LinearGradient 
        colors={['#4c669f', '#3b5998', '#192f6a']} 
        style={styles.container}
    >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Loading weather data...</Text>
    </LinearGradient>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    }
}); 