import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store/store';

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
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Add') iconName = focused ? 'add-circle' : 'add-circle-outline';
                    else if (route.name === 'My Donations') iconName = focused ? 'list' : 'list-outline';
                    else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                    else iconName = 'help-circle-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2E7D32',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            {role === 'donor' && <Tab.Screen name="Add" component={AddDonationScreen} />}
            {role === 'donor' && <Tab.Screen name="My Donations" component={MyDonationsScreen} />}
            {role === 'ngo' && <Tab.Screen name="Map" component={MapViewScreen} />}
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
                        options={{ headerShown: true, title: 'Donation Details' }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
