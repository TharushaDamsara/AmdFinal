import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Image, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { createDonation, uploadImage } from '../services/donationService';
import { RootState } from '../store/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { Location as AppLocation } from '../types';

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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
            Alert.alert('Error', 'Please fill all fields and add an image.');
            return;
        }

        setLoading(true);
        try {
            const imageUrl = await uploadImage(image);
            if (!imageUrl) throw new Error('Image upload failed');

            await createDonation({
                title,
                description,
                quantity,
                imageUrl,
                location,
                donorId: user.uid,
                donorName: user.displayName || 'Anonymous',
            });
            Alert.alert('Success', 'Food donation posted successfully!');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Failed to post donation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Food Item Title</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., Surplus Sandwiches"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter details, expiry info, etc."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            <Text style={styles.label}>Quantity / Servings</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., 20 boxes"
                value={quantity}
                onChangeText={setQuantity}
            />

            <Text style={styles.label}>Food Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                    <Text style={styles.imagePickerText}>Select or Take Photo</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitButtonText}>Post Donation</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    imagePicker: {
        height: 180,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    imagePickerText: {
        color: '#666',
    },
    submitButton: {
        backgroundColor: '#2E7D32',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddDonationScreen;
