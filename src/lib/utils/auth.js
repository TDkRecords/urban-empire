// src/lib/utils/auth.js
import { browser } from '$app/environment';
import { db } from '$lib/assets/js/firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AUTH_KEY = 'urban_admin_auth';

export async function login(username, password) {
    if (!browser) {
        return { success: false, error: 'No disponible en servidor' };
    }

    try {
        // Consultar la colección administradores
        const q = query(
            collection(db, 'administradores'),
            where('usuario', '==', username),
            where('contraseña', '==', password)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Usuario encontrado
            const adminData = querySnapshot.docs[0].data();
            const authData = {
                usuario: adminData.usuario,
                timestamp: new Date().toISOString(),
                authenticated: true
            };

            localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
            return { success: true };
        } else {
            return { success: false, error: 'Credenciales incorrectas' };
        }
    } catch (error) {
        console.error('Error al verificar credenciales:', error);
        return { success: false, error: 'Error al iniciar sesión. Intente nuevamente.' };
    }
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
        return parsed.authenticated ? { usuario: parsed.usuario } : null;
    } catch {
        return null;
    }
}