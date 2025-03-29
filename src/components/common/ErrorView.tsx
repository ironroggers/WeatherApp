import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ErrorViewProps {
    error: string;
    onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => (
    <LinearGradient 
        colors={['#4c669f', '#3b5998', '#192f6a']} 
        style={styles.container}
    >
        <View style={styles.content}>
            <Feather name="alert-circle" size={50} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
            {onRetry && (
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={onRetry}
                >
                    <Feather name="refresh-cw" size={20} color="#fff" />
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            )}
        </View>
    </LinearGradient>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    retryText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    }
}); 