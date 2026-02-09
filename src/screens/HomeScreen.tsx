import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator,
    RefreshControl, TouchableOpacity, ScrollView
} from 'react-native';
import { getDonations } from '../services/donationService';
import DonationCard from '../components/DonationCard';
import { Ionicons } from '@expo/vector-icons';
import { Donation } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

type HomeScreenNavigationProp = StackNavigationProp<any, 'Home'>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchDonations = async () => {
        try {
            const data = await getDonations();
            setDonations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchDonations();
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Fetching donations...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={donations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <DonationCard
                        donation={item}
                        onPress={() => navigation.navigate('DonationDetails', { donation: item })}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="fast-food" size={60} color={COLORS.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>No Donations Yet</Text>
                        <Text style={styles.emptySubtitle}>Check back later or pull down to refresh.</Text>
                        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
                            <Text style={styles.refreshBtnText}>Refresh Feed</Text>
                        </TouchableOpacity>
                    </View>
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        ...TYPOGRAPHY.caption,
        marginTop: SPACING.md,
        color: COLORS.textSecondary,
    },
    listContent: {
        padding: SPACING.lg,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(46, 125, 50, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        ...TYPOGRAPHY.h2,
        color: COLORS.text,
    },
    emptySubtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.xs,
        paddingHorizontal: SPACING.xl,
    },
    refreshBtn: {
        marginTop: SPACING.xl,
        backgroundColor: COLORS.white,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
        ...SHADOWS.light,
    },
    refreshBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default HomeScreen;

