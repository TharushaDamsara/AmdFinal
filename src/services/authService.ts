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
        dispatch(setError(err.message));
    }
};

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            dispatch(setUser({
                user: { uid: user.uid, email: user.email, displayName: userData.displayName },
                role: userData.role as UserRole
            }));
        }
    } catch (err: any) {
        dispatch(setError(err.message));
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
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                dispatch(setUser({
                    user: { uid: user.uid, email: user.email, displayName: userData.displayName },
                    role: userData.role as UserRole
                }));
            }
        } else {
            dispatch(logout());
        }
    });
};
