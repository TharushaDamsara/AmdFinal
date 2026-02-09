import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Donation } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

interface DonationCardProps {
    donation: Donation;
    onPress: () => void;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <Image source={{ uri: donation.imageUrl }} style={styles.image} />
            <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, donation.status === 'available' ? styles.availableBadge : styles.pendingBadge]}>
                    <Text style={[styles.statusText, donation.status === 'available' ? styles.availableText : styles.pendingText]}>
                        {donation.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{donation.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{donation.description}</Text>

                <View style={styles.divider} />

                <View style={styles.footer}>
                    <View style={styles.infoItem}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="cube" size={14} color={COLORS.primary} />
                        </View>
                        <Text style={styles.infoText}>{donation.quantity}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="location" size={14} color={COLORS.primary} />
                        </View>
                        <Text style={styles.infoText}>Nearby</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="person" size={14} color={COLORS.primary} />
                        </View>
                        <Text style={styles.infoText}>{donation.donorName}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: COLORS.background,
    },
    statusContainer: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
        ...SHADOWS.light,
    },
    availableBadge: {
        backgroundColor: '#E8F5E9',
    },
    pendingBadge: {
        backgroundColor: '#FFF3E0',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    availableText: {
        color: COLORS.success,
    },
    pendingText: {
        color: '#EF6C00',
    },
    content: {
        padding: SPACING.md,
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text,
        marginBottom: 4,
    },
    description: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: SPACING.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.textSecondary,
    },
});

export default DonationCard;

