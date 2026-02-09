import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../store/store';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

const ProfileScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, role } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => dispatch(logoutUser())
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={60} color={COLORS.primary} />
                    </View>
                    <TouchableOpacity style={styles.editAvatarBtn}>
                        <Ionicons name="camera" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{user?.displayName || 'User Name'}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                <View style={styles.badgeContainer}>
                    <View style={[styles.roleBadge, { backgroundColor: role === 'donor' ? COLORS.primary : COLORS.accent }]}>
                        <Ionicons
                            name={role === 'donor' ? 'heart' : 'business'}
                            size={12}
                            color={role === 'donor' ? COLORS.white : COLORS.text}
                        />
                        <Text style={[styles.roleText, { color: role === 'donor' ? COLORS.white : COLORS.text }]}>
                            {role === 'donor' ? 'GENEROUS DONOR' : 'NGO PARTNER'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.card}>
                    <ProfileMenuItem
                        icon="person-outline"
                        title="Edit Profile"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon="notifications-outline"
                        title="Notification Settings"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon="shield-checkmark-outline"
                        title="Privacy & Security"
                        onPress={() => { }}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.card}>
                    <ProfileMenuItem
                        icon="help-circle-outline"
                        title="Help Center"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon="information-circle-outline"
                        title="About Amd"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon="log-out-outline"
                        title="Logout"
                        onPress={handleLogout}
                        isLogout
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.version}>Version 1.0.0 (Build 124)</Text>
            </View>
        </ScrollView>
    );
};

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    isLogout?: boolean;
}

const ProfileMenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, isLogout }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.menuIconContainer, isLogout && styles.logoutIconBg]}>
            <Ionicons name={icon} size={22} color={isLogout ? COLORS.error : COLORS.primary} />
        </View>
        <Text style={[styles.menuText, isLogout && styles.logoutText]}>{title}</Text>
        <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
        ...SHADOWS.light,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    avatarCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    name: {
        ...TYPOGRAPHY.h2,
        color: COLORS.text,
    },
    email: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    badgeContainer: {
        marginTop: SPACING.md,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.full,
        gap: 6,
    },
    roleText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.xl,
    },
    sectionTitle: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.light,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(46, 125, 50, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    logoutIconBg: {
        backgroundColor: 'rgba(211, 47, 47, 0.05)',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
    },
    logoutText: {
        color: COLORS.error,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
        marginBottom: 20,
    },
    version: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        opacity: 0.5,
    },
});

export default ProfileScreen;

