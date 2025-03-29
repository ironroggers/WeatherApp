import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useDebounce } from '../hooks/useDebounce';
import { searchCities } from '../services/cityService';
import CitySuggestions from '../components/CitySuggestions';
import { getSearchedCities } from '../utils/storage';
import { weatherViewModel } from '../viewmodels/weather-view.model';

const HomeScreen = ({ navigation }: any) => {
    const [city, setCity] = useState<string>('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [isOnline, setIsOnline] = useState(true);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const debouncedCity = useDebounce(city, 500);

    useEffect(() => {
        const loadRecentSearches = async () => {
            const searches = await getSearchedCities();
            setRecentSearches(searches);
        };

        loadRecentSearches();
    }, []);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(!!state.isConnected);
            if (!state.isConnected) {
                Alert.alert(
                    "No Internet Connection",
                    "You are offline. Some features may be limited."
                );
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSearch = useCallback(async () => {
        if (!city.trim()) return;

        if (!isOnline) {
            const hasCache = await weatherViewModel.hasCachedData(city);
            if (!hasCache) {
                Alert.alert(
                    "No Cached Data",
                    "This city's weather data is not available offline.",
                    [{ text: "OK" }]
                );
                return;
            }
            navigation.navigate('Weather', { city, isOffline: true });
            return;
        }

        navigation.navigate('Weather', { city });
        setSuggestions([]);
    }, [city, navigation, isOnline]);

    const handleCitySelect = async (selectedCity: string) => {
        setCity(selectedCity);
        setSuggestions([]);
        
        if (!isOnline) {
            const hasCache = await weatherViewModel.hasCachedData(selectedCity);
            if (!hasCache) {
                Alert.alert(
                    "No Cached Data",
                    "This city's weather data is not available offline.",
                    [{ text: "OK" }]
                );
                return;
            }
        }
        
        navigation.navigate('Weather', { 
            city: selectedCity,
            isOffline: !isOnline 
        });
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedCity.length < 2) {
                setSuggestions([]);
                setError('');
                return;
            }

            if (!isOnline) {
                setError('No internet connection');
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const results = await searchCities(debouncedCity);
                setSuggestions(results);
                if (results.length === 0) {
                    setError('No cities found');
                }
            } catch (error) {
                setError('Failed to fetch city suggestions');
                Alert.alert(
                    "Error",
                    "Failed to fetch city suggestions. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedCity, isOnline]);

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
                    <Text style={styles.subtitle}>
                        {isOnline ? 'Discover the weather in your city' : 'Offline Mode - Limited Features'}
                    </Text>
                    
                    <View style={styles.searchContainer}>
                        <Feather name="map-pin" size={24} color="#fff" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Enter city name (min. 2 characters)"
                            placeholderTextColor="rgba(255,255,255,0.7)"
                            value={city}
                            onChangeText={setCity}
                            style={styles.input}
                        />
                        {city.length > 0 && (
                            <TouchableOpacity 
                                onPress={() => setCity('')}
                                style={styles.clearButton}
                            >
                                <Feather name="x" size={20} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <CitySuggestions 
                        suggestions={suggestions}
                        onSelectCity={handleCitySelect}
                        isLoading={isLoading}
                        error={error}
                    />

                    {recentSearches.length > 0 && !city && (
                        <View style={styles.recentContainer}>
                            <Text style={styles.recentTitle}>Recent Searches</Text>
                            {recentSearches.map((recentCity, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.recentItem}
                                    onPress={() => handleCitySelect(recentCity)}
                                >
                                    <Feather name="clock" size={16} color="rgba(255,255,255,0.7)" />
                                    <Text style={styles.recentText}>{recentCity}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            (!city.trim()) && styles.buttonDisabled
                        ]}
                        onPress={handleSearch}
                        activeOpacity={0.8}
                        disabled={!city.trim()}
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
    buttonDisabled: {
        opacity: 0.5,
    },
    clearButton: {
        padding: 8,
    },
    recentContainer: {
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 15,
    },
    recentTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    recentText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 14,
    }
});

export default HomeScreen;
