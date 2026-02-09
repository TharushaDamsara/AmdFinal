import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../services/authService';
import { RootState, AppDispatch } from '../store/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserRole } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');

type RegisterNavigationProp = StackNavigationProp<any, 'Register'>;

interface Props {
    navigation: RegisterNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [role, setRole] = useState<UserRole>('donor');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleRegister = () => {
        if (email && password && displayName) {
            dispatch(registerUser(email, password, role, displayName));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.background}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Ionicons name="person-add" size={40} color={COLORS.white} />
                    </View>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join our community of savers</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={COLORS.textSecondary}
                            value={displayName}
                            onChangeText={setDisplayName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor={COLORS.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={COLORS.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color={COLORS.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>I want to register as:</Text>
                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={[styles.roleButton, role === 'donor' && styles.roleButtonActive]}
                            onPress={() => setRole('donor')}
                        >
                            <Ionicons
                                name="heart"
                                size={20}
                                color={role === 'donor' ? COLORS.white : COLORS.primary}
                            />
                            <Text style={[styles.roleText, role === 'donor' && styles.roleTextActive]}>Donor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleButton, role === 'ngo' && styles.roleButtonActive]}
                            onPress={() => setRole('ngo')}
                        >
                            <Ionicons
                                name="business"
                                size={20}
                                color={role === 'ngo' ? COLORS.white : COLORS.primary}
                            />
                            <Text style={[styles.roleText, role === 'ngo' && styles.roleTextActive]}>NGO</Text>
                        </TouchableOpacity>
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, (!email || !password || !displayName) && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading || !email || !password || !displayName}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.link}
                    >
                        <Text style={styles.linkText}>
                            Already have an account? <Text style={styles.linkTextBold}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        marginBottom: SPACING.xl,
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: SPACING.sm,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: COLORS.white,
        textAlign: 'center',
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        ...SHADOWS.heavy,
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        height: 55,
        color: COLORS.text,
        fontSize: 16,
    },
    label: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    roleContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
        gap: 8,
    },
    roleButtonActive: {
        backgroundColor: COLORS.primary,
    },
    roleText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    roleTextActive: {
        color: COLORS.white,
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 55,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.sm,
        ...SHADOWS.medium,
    },
    buttonDisabled: {
        backgroundColor: COLORS.secondary,
        opacity: 0.7,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        gap: 5,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
    },
    link: {
        marginTop: SPACING.lg,
        alignItems: 'center',
    },
    linkText: {
        color: COLORS.textSecondary,
        fontSize: 15,
    },
    linkTextBold: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
