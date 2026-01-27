import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { setUser, setLoading, setError, logout } from "../store/slices/authSlice";

export const registerUser = (email, password, role, displayName) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data in Firestore
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
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const loginUser = (email, password) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            dispatch(setUser({
                user: { uid: user.uid, email: user.email, displayName: userData.displayName },
                role: userData.role
            }));
        }
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const logoutUser = () => async (dispatch) => {
    try {
        await signOut(auth);
        dispatch(logout());
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const subscribeToAuthChanges = () => (dispatch) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                dispatch(setUser({
                    user: { uid: user.uid, email: user.email, displayName: userData.displayName },
                    role: userData.role
                }));
            }
        } else {
            dispatch(logout());
        }
    });
};
