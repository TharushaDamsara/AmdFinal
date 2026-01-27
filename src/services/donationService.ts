import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy, DocumentData } from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import { Donation, DonationStatus } from "../types";

export const uploadImage = async (uri: string): Promise<string | null> => {
    if (!uri) return null;
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `donations/${Date.now()}_${filename}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
};

export const createDonation = async (donationData: Omit<Donation, 'id' | 'status' | 'createdAt'>): Promise<string> => {
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

export const getDonations = async (status: DonationStatus = 'available'): Promise<Donation[]> => {
    try {
        const q = query(
            collection(db, "donations"),
            where("status", "==", status),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
    } catch (error) {
        console.error("Error fetching donations: ", error);
        throw error;
    }
};

export const getDonorDonations = async (donorId: string): Promise<Donation[]> => {
    try {
        const q = query(
            collection(db, "donations"),
            where("donorId", "==", donorId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
    } catch (error) {
        console.error("Error fetching donor donations: ", error);
        throw error;
    }
};

export const updateDonationStatus = async (donationId: string, status: DonationStatus): Promise<void> => {
    try {
        const docRef = doc(db, "donations", donationId);
        await updateDoc(docRef, { status });
    } catch (error) {
        console.error("Error updating donation: ", error);
        throw error;
    }
};

export const deleteDonation = async (donationId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "donations", donationId));
    } catch (error) {
        console.error("Error deleting donation: ", error);
        throw error;
    }
};
