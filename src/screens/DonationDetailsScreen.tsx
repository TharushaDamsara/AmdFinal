import React from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView,
    TouchableOpacity, Alert, Linking, Platform, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { updateDonationStatus } from '../services/donationService';
import { RootState } from '../store/store';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Donation } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

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
            "Confirm you want to accept this donation and coordinate pickup?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Accept",
                    onPress: async () => {
                        try {
                            await updateDonationStatus(donation.id, 'pending');
                            Alert.alert("Success", "Donation accepted! You can now coordinate the pickup with the donor.");
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
        <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" />
            <View style={styles.imageContainer}>
                <Image source={{ uri: donation.imageUrl }} style={styles.image} />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.indicator} />

                <View style={styles.header}>
                    <Text style={styles.title}>{donation.title}</Text>
                    <View style={[styles.statusBadge, donation.status === 'available' ? styles.availableBadge : styles.pendingBadge]}>
                        <Text style={[styles.statusText, donation.status === 'available' ? styles.availableText : styles.pendingText]}>
                            {donation.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoBox}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="cube" size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Quantity</Text>
                            <Text style={styles.infoValue}>{donation.quantity}</Text>
                        </View>
                    </View>
                    <View style={styles.infoBox}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="person" size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Donor</Text>
                            <Text style={styles.infoValue}>{donation.donorName}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{donation.description}</Text>
                </View>

                <TouchableOpacity style={styles.locationButton} onPress={openMaps} activeOpacity={0.8}>
                    <View style={styles.locationIconBg}>
                        <Ionicons name="location" size={22} color={COLORS.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.locationTitle}>Pickup Location</Text>
                        <Text style={styles.locationSubtitle}>Tap to view on Google Maps</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                {role === 'ngo' && donation.status === 'available' && (
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAccept} activeOpacity={0.9}>
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
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 350,
        backgroundColor: COLORS.border,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -40,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    indicator: {
        width: 40,
        height: 5,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: COLORS.text,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.sm,
        marginLeft: SPACING.sm,
    },
    availableBadge: {
        backgroundColor: '#E8F5E9',
    },
    pendingBadge: {
        backgroundColor: '#FFF3E0',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    availableText: {
        color: COLORS.success,
    },
    pendingText: {
        color: '#EF6C00',
    },
    infoGrid: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    infoBox: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        gap: SPACING.sm,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    description: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    locationButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 30,
    },
    locationIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    locationSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    acceptButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        marginBottom: 40,
        ...SHADOWS.medium,
    },
    acceptButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DonationDetailsScreen;

