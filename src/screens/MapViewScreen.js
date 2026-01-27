import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDonations } from '../services/donationService';

const MapViewScreen = ({ navigation }) => {
    const [region, setRegion] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            try {
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
            <MapView
                style={styles.map}
                initialRegion={region}
                showsUserLocation
            >
                {donations.map((donation) => (
                    <Marker
                        key={donation.id}
                        coordinate={{
                            latitude: donation.location.latitude,
                            longitude: donation.location.longitude,
                        }}
                        pinColor="#2E7D32"
                    >
                        <Callout onPress={() => navigation.navigate('DonationDetails', { donation })}>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{donation.title}</Text>
                                <Text style={styles.calloutDesc}>{donation.quantity}</Text>
                                <Text style={styles.calloutLink}>View Details</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    callout: {
        padding: 10,
        width: 150,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    calloutDesc: {
        fontSize: 12,
        color: '#666',
        marginVertical: 2,
    },
    calloutLink: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default MapViewScreen;
