import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { subscribeToAuthChanges } from './src/services/authService';
import { StatusBar } from 'expo-status-bar';

const AppContent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const unsubscribe = dispatch(subscribeToAuthChanges());
        return () => unsubscribe();
    }, [dispatch]);

    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}
