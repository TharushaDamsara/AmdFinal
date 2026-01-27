import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Donation } from '../types';

interface DonationCardProps {
    donation: Donation;
    onPress: () => void;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: donation.imageUrl }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{donation.title}</Text>
                    <View style={[styles.statusBadge, donation.status === 'available' ? styles.available : styles.pending]}>
                        <Text style={styles.statusText}>{donation.status.toUpperCase()}</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>{donation.description}</Text>

                <View style={styles.footer}>
                    <View style={styles.infoItem}>
                        <Ionicons name="cube-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{donation.quantity}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>Nearby</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="person-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{donation.donorName}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#f0f0f0',
    },
    content: {
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    available: {
        backgroundColor: '#E8F5E9',
    },
    pending: {
        backgroundColor: '#FFF3E0',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
    },
});

export default DonationCard;
