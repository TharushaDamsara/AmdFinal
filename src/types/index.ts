export type UserRole = 'donor' | 'ngo' | 'admin';

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

export interface UserProfile extends User {
    role: UserRole;
    createdAt: string;
    location?: Location;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export type DonationStatus = 'available' | 'pending' | 'collected' | 'expired';

export interface Donation {
    id: string;
    donorId: string;
    donorName: string;
    title: string;
    description: string;
    quantity: string;
    imageUrl: string;
    location: Location;
    status: DonationStatus;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    role: UserRole | null;
    loading: boolean;
    error: string | null;
}
