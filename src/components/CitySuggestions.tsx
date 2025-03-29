import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView,
    ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CityResult {
    city: string;
    country: string;
    countryCode: string;
}

interface CitySuggestionsProps {
    suggestions: CityResult[];
    onSelectCity: (city: string) => void;
    isLoading?: boolean;
    error?: string;
}

const CitySuggestions: React.FC<CitySuggestionsProps> = ({ 
    suggestions, 
    onSelectCity,
    isLoading,
    error 
}) => {
    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={20} color="#ff6b6b" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#4A90E2" />
                    <Text style={styles.loadingText}>Searching cities...</Text>
                </View>
            </View>
        );
    }

    if (!suggestions?.length) return null;

    return (
        <ScrollView 
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            bounces={false}
        >
            {suggestions.map((item, index) => (
                <TouchableOpacity
                    key={`${item.city}-${item.countryCode}-${index}`}
                    style={[
                        styles.suggestionItem,
                        index === suggestions.length - 1 && styles.lastItem
                    ]}
                    onPress={() => onSelectCity(item.city)}
                >
                    <View style={styles.suggestionContent}>
                        <Feather name="map-pin" size={16} color="#4A90E2" style={styles.icon} />
                        <View>
                            <Text style={styles.cityText}>{item.city}</Text>
                            <Text style={styles.countryText}>{item.country}</Text>
                        </View>
                    </View>
                    <Feather name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: 250,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 12,
        marginTop: 4,
    },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    suggestionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 12,
    },
    cityText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    countryText: {
        color: '#666',
        fontSize: 14,
        marginTop: 2,
    },
    loadingContainer: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginLeft: 10,
        color: '#666',
    },
    errorContainer: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        marginLeft: 8,
        color: '#ff6b6b',
        fontSize: 14,
    }
});

export default CitySuggestions; 