import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../services/authService';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [role, setRole] = useState('donor'); // Default role
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleRegister = () => {
        if (email && password && displayName) {
            dispatch(registerUser(email, password, role, displayName));
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us in reducing food waste</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={displayName}
                    onChangeText={setDisplayName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Text style={styles.label}>Register as:</Text>
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[styles.roleButton, role === 'donor' && styles.roleButtonActive]}
                        onPress={() => setRole('donor')}
                    >
                        <Text style={[styles.roleText, role === 'donor' && styles.roleTextActive]}>Donor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleButton, role === 'ngo' && styles.roleButtonActive]}
                        onPress={() => setRole('ngo')}
                    >
                        <Text style={[styles.roleText, role === 'ngo' && styles.roleTextActive]}>NGO / Volunteer</Text>
                    </TouchableOpacity>
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.link}
                >
                    <Text style={styles.linkText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    form: {
        gap: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginTop: 10,
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    roleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2E7D32',
        alignItems: 'center',
    },
    roleButtonActive: {
        backgroundColor: '#2E7D32',
    },
    roleText: {
        color: '#2E7D32',
        fontWeight: '600',
    },
    roleTextActive: {
        color: '#fff',
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    button: {
        backgroundColor: '#2E7D32',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#D32F2F',
        textAlign: 'center',
    },
    link: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: '#2E7D32',
        fontSize: 16,
    },
});

export default RegisterScreen;
