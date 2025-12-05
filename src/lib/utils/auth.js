// src/lib/utils/auth.js
import { browser } from '$app/environment';

const ADMIN_CREDENTIALS = {
    email: 'admin@urbanempire.com',
    password: 'admin123'
};

const AUTH_KEY = 'urban_admin_auth';

export function login(email, password) {
    if (!browser) {
        return { success: false, error: 'No disponible en servidor' };
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const authData = {
            email,
            timestamp: new Date().toISOString(),
            authenticated: true
        };

        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
        return { success: true };
    }

    return { success: false, error: 'Credenciales incorrectas' };
}

export function logout() {
    if (!browser) return;
    localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
    if (!browser) return false;

    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;

    try {
        const parsed = JSON.parse(authData);
        return parsed.authenticated === true;
    } catch {
        return false;
    }
}

export function getCurrentUser() {
    if (!browser) return null;

    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;

    try {
        const parsed = JSON.parse(authData);
        return parsed.authenticated ? { email: parsed.email } : null;
    } catch {
        return null;
    }
}