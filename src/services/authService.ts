import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { setUser, setLoading, setError, logout } from "../store/slices/authSlice";
import { AppDispatch } from "../store/store";
import { UserRole, User } from "../types";

export const registerUser = (email: string, password: string, role: UserRole, displayName: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email,
            role,
            displayName,
            createdAt: new Date().toISOString(),
        });

        dispatch(setUser({
            user: { uid: user.uid, email: user.email, displayName },
            role
        }));
    } catch (err: any) {
        console.error("Firebase Auth Error:", err);
        dispatch(setError(err.message));
    }
};

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                dispatch(setUser({
                    user: { uid: user.uid, email: user.email, displayName: userData.displayName },
                    role: userData.role as UserRole
                }));
            } else {
                // User doc doesn't exist but auth succeeded
                dispatch(setUser({
                    user: { uid: user.uid, email: user.email, displayName: user.displayName || "" },
                    role: undefined as any
                }));
            }
        } catch (docErr: any) {
            console.warn("Firestore user data fetch failed (likely offline or permission issue):", docErr.message);
            // Fallback to basic info if doc fetch fails but auth was successful
            dispatch(setUser({
                user: { uid: user.uid, email: user.email, displayName: user.displayName || "" },
                role: undefined as any
            }));
        }
    } catch (err: any) {
        console.error("Login Error:", err);
        let message = "An error occurred during login.";

        switch (err.code) {
            case 'auth/invalid-email':
                message = "The email address is badly formatted.";
                break;
            case 'auth/user-disabled':
                message = "This user account has been disabled.";
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                message = "Invalid email or password. Please try again.";
                break;
            case 'auth/network-request-failed':
                message = "Network error. Please check your connection.";
                break;
            default:
                message = err.message || message;
        }
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const logoutUser = () => async (dispatch: AppDispatch) => {
    try {
        await signOut(auth);
        dispatch(logout());
    } catch (err: any) {
        dispatch(setError(err.message));
    }
};

export const subscribeToAuthChanges = () => (dispatch: AppDispatch) => {
    return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    dispatch(setUser({
                        user: { uid: user.uid, email: user.email, displayName: userData.displayName },
                        role: userData.role as UserRole
                    }));
                }
            } catch (err: any) {
                console.warn("Firestore background sync failed (likely offline):", err.message);
                // Fallback: use auth user info if doc fetch fails
                dispatch(setUser({
                    user: { uid: user.uid, email: user.email, displayName: user.displayName || "" },
                    role: undefined as any // Role might be unavailable offline if not cached
                }));
            }
        } else {
            dispatch(logout());
        }
    });
};
