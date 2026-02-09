import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { createDonation } from '../services/donationService';
import { RootState } from '../store/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { Location as AppLocation } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

type AddDonationNavigationProp = StackNavigationProp<any, 'Add'>;

interface Props {
    navigation: AddDonationNavigationProp;
}

const AddDonationScreen: React.FC<Props> = ({ navigation }) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState<AppLocation | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to list donations.');
            } else {
                const currLoc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: currLoc.coords.latitude,
                    longitude: currLoc.coords.longitude,
                });
            }
        })();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !quantity || !image || !location || !user) {
            Alert.alert('Incomplete Fields', 'Please fill all fields and add an image to proceed.');
            return;
        }

        setLoading(true);
        try {
            const placeholderUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";

            await createDonation({
                title,
                description,
                quantity,
                imageUrl: placeholderUrl,
                location,
                donorId: user.uid,
                donorName: user.displayName || 'Anonymous',
            });
            Alert.alert('Success', 'Your donation has been posted!');
            navigation.navigate('Home');
        } catch (error) {
            console.error("Post Error:", error);
            Alert.alert('Error', 'Failed to post donation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>What are you donating?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., surplus sandwiches, fresh produce"
                        placeholderTextColor={COLORS.textSecondary}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description & Expiry</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Provide details about the food and its freshness..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantity / Servings</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 5 servings, 10 lunch boxes"
                        placeholderTextColor={COLORS.textSecondary}
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                </View>

                <Text style={styles.label}>Food Photo</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.pickerPlaceholder}>
                            <Ionicons name="camera-outline" size={40} color={COLORS.primary} />
                            <Text style={styles.imagePickerText}>Select or Take Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitButton, (!title || !description || !quantity || !image) && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading || !title || !description || !quantity || !image}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.submitButtonText}>Post Donation</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.lg,
        backgroundColor: COLORS.white,
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    input: {
        backgroundColor: COLORS.background,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 16,
        color: COLORS.text,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    imagePicker: {
        height: 200,
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        marginBottom: SPACING.xl,
        overflow: 'hidden',
    },
    pickerPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    imagePickerText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.primary,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        ...SHADOWS.medium,
        marginBottom: 40,
    },
    buttonDisabled: {
        backgroundColor: COLORS.secondary,
        opacity: 0.6,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddDonationScreen;

