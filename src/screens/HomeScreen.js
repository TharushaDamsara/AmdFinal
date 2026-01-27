import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator,
    RefreshControl, TouchableOpacity
} from 'react-native';
import { getDonations } from '../services/donationService';
import DonationCard from '../components/DonationCard';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
                    <DonationCard
                        donation={item}
                        onPress={() => navigation.navigate('DonationDetails', { donation: item })}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="fast-food-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyText}>No food donations available right now.</Text>
                        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
                            <Text style={styles.refreshBtnText}>Check Again</Text>
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
    refreshBtn: {
        marginTop: 20,
        padding: 10,
    },
    refreshBtnText: {
        color: '#2E7D32',
        fontWeight: 'bold',
    }
});

export default HomeScreen;
