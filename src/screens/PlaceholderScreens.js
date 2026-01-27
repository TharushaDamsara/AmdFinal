import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ name }) => (
    <View style={styles.container}>
        <Text style={styles.text}>{name} Screen</Text>
        <Text style={styles.subtext}>Coming Soon...</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    text: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
    subtext: { fontSize: 16, color: '#666', marginTop: 10 }
});

export const HomeScreen = () => <PlaceholderScreen name="Home" />;
export const AddDonationScreen = () => <PlaceholderScreen name="Add Donation" />;
export const MyDonationsScreen = () => <PlaceholderScreen name="My Donations" />;
export const ProfileScreen = () => <PlaceholderScreen name="Profile" />;
export const MapViewScreen = () => <PlaceholderScreen name="Map View" />;
export const DonationDetailsScreen = () => <PlaceholderScreen name="Donation Details" />;
