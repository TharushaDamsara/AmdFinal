import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db, storage } from "./firebaseConfig";

// Upload image to Firebase Storage
export const uploadImage = async (uri) => {
    if (!uri) return null;
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `donations/${Date.now()}_${filename}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
};

// Create a new donation
export const createDonation = async (donationData) => {
    try {
        const docRef = await addDoc(collection(db, "donations"), {
            ...donationData,
            status: 'available',
            createdAt: new Date().toISOString(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding donation: ", error);
        throw error;
    }
};

// Fetch donations (optional filters)
export const getDonations = async (status = 'available') => {
    try {
        const q = query(
            collection(db, "donations"),
            where("status", "==", status),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching donations: ", error);
        throw error;
    }
};

// Fetch donations by donor
export const getDonorDonations = async (donorId) => {
    try {
        const q = query(
            collection(db, "donations"),
            where("donorId", "==", donorId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching donor donations: ", error);
        throw error;
    }
};

// Update donation status
export const updateDonationStatus = async (donationId, status) => {
    try {
        const docRef = doc(db, "donations", donationId);
        await updateDoc(docRef, { status });
    } catch (error) {
        console.error("Error updating donation: ", error);
        throw error;
    }
};

// Delete donation
export const deleteDonation = async (donationId) => {
    try {
        await deleteDoc(doc(db, "donations", donationId));
    } catch (error) {
        console.error("Error deleting donation: ", error);
        throw error;
    }
};
