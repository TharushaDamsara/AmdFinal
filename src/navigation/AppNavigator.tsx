import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store/store';
import { Platform, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AddDonationScreen from '../screens/AddDonationScreen';
import HomeScreen from '../screens/HomeScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import DonationDetailsScreen from '../screens/DonationDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MapViewScreen from '../screens/MapViewScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs: React.FC = () => {
    const { role } = useSelector((state: RootState) => state.auth);

    return (
        <Tab.Navigator
            id="MainTabs"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Add') iconName = focused ? 'add-circle' : 'add-circle-outline';
                    else if (route.name === 'My Donations') iconName = focused ? 'list' : 'list-outline';
                    else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                    else iconName = 'help-circle-outline';

                    return (
                        <View style={focused ? styles.activeTabIcon : null}>
                            <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />
                        </View>
                    );
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: Platform.OS === 'ios' ? 0 : 5,
                },
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 90 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                    backgroundColor: COLORS.white,
                    borderTopWidth: 0,
                    ...SHADOWS.medium,
                },
                headerStyle: {
                    backgroundColor: COLORS.white,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                },
                headerTitleStyle: {
                    ...TYPOGRAPHY.h3,
                    color: COLORS.text,
                },
                headerTitleAlign: 'center',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Explore' }} />
            {role === 'donor' && <Tab.Screen name="Add" component={AddDonationScreen} options={{ title: 'Post' }} />}
            {role === 'donor' && <Tab.Screen name="My Donations" component={MyDonationsScreen} options={{ title: 'Listings' }} />}
            {role === 'ngo' && <Tab.Screen name="Map" component={MapViewScreen} options={{ title: 'NGO Map' }} />}
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <Stack.Navigator
            id="RootStack"
            screenOptions={{ headerShown: false }}
        >
            {!user ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen
                        name="DonationDetails"
                        component={DonationDetailsScreen}
                        options={{
                            headerShown: true,
                            title: 'Donation Details',
                            headerStyle: {
                                backgroundColor: COLORS.white,
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTitleStyle: {
                                ...TYPOGRAPHY.h3,
                                color: COLORS.text,
                            },
                            headerTintColor: COLORS.primary,
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    activeTabIcon: {
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        padding: 8,
        borderRadius: 12,
        marginTop: -5,
    }
});

export default AppNavigator;

