// src/globalState/authStore.ts
import { create } from 'zustand';

interface User {
    id: number;
    name: string;
    lastname: string;
    idRol: number;
    rolName: string;
}

interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    currentUser: null,

    login: (user: User) =>
        set({
            isAuthenticated: true,
            currentUser: user,
        }),

    logout: () =>
        set({
            isAuthenticated: false,
            currentUser: null,
        }),
}));
