import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const HomeScreen = ({ navigation }: any) => {
    const [city, setCity] = useState<string>('');

    const handleSearch = () => {
        if (city.trim()) {
            navigation.navigate('Weather', { city });
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/weather-bg.jpg')}
            style={styles.background}
        >
            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Weather Forecast</Text>
                    <Text style={styles.subtitle}>Discover the weather in your city</Text>
                    
                    <View style={styles.searchContainer}>
                        <Feather name="map-pin" size={24} color="#fff" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Enter city name"
                            placeholderTextColor="rgba(255,255,255,0.7)"
                            value={city}
                            onChangeText={setCity}
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSearch}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get Weather</Text>
                        <Feather name="arrow-right" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 10,
    },
});

export default HomeScreen;
