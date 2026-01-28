import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import { getDonations } from '../services/donationService';
import { Donation } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type MapViewNavigationProp = StackNavigationProp<any, 'Map'>;

interface Props {
    navigation: MapViewNavigationProp;
}

const MapViewScreen: React.FC<Props> = ({ navigation }) => {
    const [region, setRegion] = useState<any>(undefined);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                if (typeof window !== 'undefined') {
                    window.alert('Permission Denied: Permission to access location was denied');
                }
                return;
            }

            try {
                let location = await Location.getCurrentPositionAsync({});
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                const data = await getDonations();
                setDonations(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.webMapPlaceholder}>
                <Text style={styles.placeholderText}>Map is not available on web yet.</Text>
                <Text style={styles.placeholderSubText}>Showing list of donations instead:</Text>
            </View>
            <View style={styles.listContainer}>
                {donations.map((donation) => (
                    <View key={donation.id} style={styles.donationItem}>
                        <Text style={styles.donationTitle}>{donation.title}</Text>
                        <Text style={styles.donationDetails}>{donation.quantity}</Text>
                        <Text
                            style={styles.viewLink}
                            onPress={() => navigation.navigate('DonationDetails', { donation })}
                        >
                            View Details
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webMapPlaceholder: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholderSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    listContainer: {
        padding: 15,
    },
    donationItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#2E7D32',
    },
    donationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    donationDetails: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    viewLink: {
        color: '#2E7D32',
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default MapViewScreen;
