import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../services/authService';
import { RootState, AppDispatch } from '../store/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');

type LoginNavigationProp = StackNavigationProp<any, 'Login'>;

interface Props {
    navigation: LoginNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = () => {
        if (email && password) {
            dispatch(loginUser(email, password));
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

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="leaf" size={40} color={COLORS.white} />
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Let's continue saving food together</Text>
                </View>

                <View style={styles.card}>
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

                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, (!email || !password) && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading || !email || !password}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        style={styles.link}
                    >
                        <Text style={styles.linkText}>
                            Don't have an account? <Text style={styles.linkTextBold}>Create one</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        height: '45%',
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
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

export default LoginScreen;
