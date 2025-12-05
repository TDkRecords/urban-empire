// src/lib/utils/auth.js
import { browser } from '$app/environment';
import { auth } from '$lib/assets/js/firebase';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const AUTH_KEY = 'admin_auth';

// Función para manejar el estado de autenticación
const handleAuthState = (user) => {
    if (!browser) return null;

    if (user) {
        return user;
    } else {
        localStorage.removeItem(AUTH_KEY);
        return null;
    }
};

// Inicializar el observador de autenticación
let authStateInitialized = false;
if (browser && !authStateInitialized) {
    authStateInitialized = true;
    onAuthStateChanged(auth, (user) => {
        const userData = handleAuthState(user);
        if (userData) {
            // Actualizar el token en localStorage
            user.getIdToken().then(token => {
                localStorage.setItem(AUTH_KEY, JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    token: token
                }));
            });
        }
    });
}

export const isAuthenticated = () => {
    if (!browser) return false;
    const userData = localStorage.getItem(AUTH_KEY);
    if (!userData) return false;

    try {
        const user = JSON.parse(userData);
        return !!(user && user.token);
    } catch {
        localStorage.removeItem(AUTH_KEY);
        return false;
    }
};

export const login = async (email, password) => {
    if (!browser) return { success: false, error: 'Navegador no soportado' };

    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const token = await user.getIdToken();

        const userData = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            token: token
        };

        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        return { success: true, user: userData };
    } catch (error) {
        console.error('Login error:', error);
        let message = 'Error al iniciar sesión. Intente de nuevo.';

        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                message = 'Correo o contraseña incorrectos';
                break;
            case 'auth/too-many-requests':
                message = 'Demasiados intentos fallidos. Intente más tarde.';
                break;
            case 'auth/user-disabled':
                message = 'Esta cuenta ha sido deshabilitada';
                break;
        }

        return { success: false, error: message };
    }
};

export const logout = async () => {
    if (!browser) return { success: false, error: 'Navegador no soportado' };

    try {
        await signOut(auth);
        localStorage.removeItem(AUTH_KEY);
        window.location.href = '/admin-panel-2025/login';
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: 'Error al cerrar sesión' };
    }
};

export const getCurrentUser = () => {
    if (!browser) return null;
    const userData = localStorage.getItem(AUTH_KEY);
    if (!userData) return null;

    try {
        return JSON.parse(userData);
    } catch {
        localStorage.removeItem(AUTH_KEY);
        return null;
    }
};