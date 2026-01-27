import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator,
    RefreshControl, TouchableOpacity, Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { getDonorDonations, deleteDonation } from '../services/donationService';
import DonationCard from '../components/DonationCard';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store/store';
import { Donation } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

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
                            Alert.alert("Success", "Donation removed.");
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete.");
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={donations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <DonationCard
                            donation={item}
                            onPress={() => navigation.navigate('DonationDetails', { donation: item })}
                        />
                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                                <Text style={styles.deleteBtnText}>Remove Listing</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="list-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyText}>You haven't posted any donations yet.</Text>
                        <TouchableOpacity
                            style={styles.postBtn}
                            onPress={() => navigation.navigate('Add')}
                        >
                            <Text style={styles.postBtnText}>Post a Donation</Text>
                        </TouchableOpacity>
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: -10,
        marginBottom: 20,
        paddingRight: 5,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    deleteBtnText: {
        color: '#D32F2F',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 20,
        textAlign: 'center',
    },
    postBtn: {
        marginTop: 20,
        backgroundColor: '#2E7D32',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
    },
    postBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});

export default MyDonationsScreen;
