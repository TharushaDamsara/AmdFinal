import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator,
    RefreshControl, TouchableOpacity, Alert, Platform
} from 'react-native';
import { useSelector } from 'react-redux';
import { getDonorDonations, deleteDonation } from '../services/donationService';
import DonationCard from '../components/DonationCard';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store/store';
import { Donation } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

type MyDonationsNavigationProp = StackNavigationProp<any, 'My Donations'>;

interface Props {
    navigation: MyDonationsNavigationProp;
}

const MyDonationsScreen: React.FC<Props> = ({ navigation }) => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.auth);

    const fetchMyDonations = async () => {
        if (!user) return;
        try {
            const data = await getDonorDonations(user.uid);
            setDonations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMyDonations();
    }, [user?.uid]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMyDonations();
    }, [user?.uid]);

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Donation",
            "Are you sure you want to remove this listing? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDonation(id);
                            setDonations(donations.filter(d => d.id !== id));
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete.");
                        }
                    }
                }
            ]
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Fetching your listings...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={donations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemWrapper}>
                        <DonationCard
                            donation={item}
                            onPress={() => navigation.navigate('DonationDetails', { donation: item })}
                        />
                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                                <Text style={styles.deleteBtnText}>Remove Listing</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                            <Ionicons name="list" size={60} color={COLORS.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>No Listings Yet</Text>
                        <Text style={styles.emptySubtitle}>You haven't posted any donations. Start by sharing what you have!</Text>
                        <TouchableOpacity
                            style={styles.postBtn}
                            onPress={() => navigation.navigate('Add')}
                        >
                            <Text style={styles.postBtnText}>Post a Donation</Text>
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
    itemWrapper: {
        marginBottom: SPACING.lg,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: -SPACING.lg,
        paddingBottom: SPACING.md,
        paddingRight: SPACING.sm,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(211, 47, 47, 0.05)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: BORDER_RADIUS.md,
    },
    deleteBtnText: {
        color: COLORS.error,
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
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
    postBtn: {
        marginTop: SPACING.xl,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: 30,
        borderRadius: BORDER_RADIUS.md,
        ...SHADOWS.medium,
    },
    postBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default MyDonationsScreen;

