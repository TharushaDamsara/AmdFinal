import React from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView,
    TouchableOpacity, Alert, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { updateDonationStatus } from '../services/donationService';
import { RootState } from '../store/store';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Donation } from '../types';

type RootStackParamList = {
    DonationDetails: { donation: Donation };
};

type DonationDetailsRouteProp = RouteProp<RootStackParamList, 'DonationDetails'>;
type DonationDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'DonationDetails'>;

interface Props {
    route: DonationDetailsRouteProp;
    navigation: DonationDetailsNavigationProp;
}

const DonationDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { donation } = route.params;
    const { role } = useSelector((state: RootState) => state.auth);

    const handleAccept = async () => {
        Alert.alert(
            "Accept Donation",
            "Are you sure you want to accept this donation and schedule a pickup?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Accept",
                    onPress: async () => {
                        try {
                            await updateDonationStatus(donation.id, 'pending');
                            Alert.alert("Success", "Donation accepted! You can now coordinate the pickup.");
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Error", "Failed to update status.");
                        }
                    }
                }
            ]
        );
    };

    const openMaps = () => {
        const { latitude, longitude } = donation.location;
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: donation.imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{donation.title}</Text>
                    <View style={[styles.statusBadge, donation.status === 'available' ? styles.available : styles.pending]}>
                        <Text style={styles.statusText}>{donation.status.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{donation.description}</Text>
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoBox}>
                        <Ionicons name="cube-outline" size={24} color="#2E7D32" />
                        <Text style={styles.infoLabel}>Quantity</Text>
                        <Text style={styles.infoValue}>{donation.quantity}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Ionicons name="person-outline" size={24} color="#2E7D32" />
                        <Text style={styles.infoLabel}>Donor</Text>
                        <Text style={styles.infoValue}>{donation.donorName}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.locationButton} onPress={openMaps}>
                    <Ionicons name="location-outline" size={20} color="#fff" />
                    <Text style={styles.locationButtonText}>View Location on Maps</Text>
                </TouchableOpacity>

                {role === 'ngo' && donation.status === 'available' && (
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                        <Text style={styles.acceptButtonText}>Accept Donation</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
        backgroundColor: '#f0f0f0',
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    available: {
        backgroundColor: '#E8F5E9',
    },
    pending: {
        backgroundColor: '#FFF3E0',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    infoBox: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    locationButton: {
        flexDirection: 'row',
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    locationButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    acceptButton: {
        backgroundColor: '#2E7D32',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 40,
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DonationDetailsScreen;
