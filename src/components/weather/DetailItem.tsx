import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface DetailItemProps {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({ 
    icon, 
    label, 
    value 
}) => {
    return (
        <View style={styles.container}>
            <Feather 
                name={icon} 
                size={24} 
                color="#fff" 
                style={styles.icon}
            />
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
    },
    icon: {
        marginBottom: 8,
    },
    label: {
        color: '#fff',
        opacity: 0.7,
        fontSize: 14,
        marginBottom: 4,
    },
    value: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    }
}); 