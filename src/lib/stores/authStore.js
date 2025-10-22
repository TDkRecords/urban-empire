import { writable } from 'svelte/store';
import { auth } from '$lib/assets/js/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { browser } from '$app/environment';

// Store para el usuario autenticado
export const user = writable(null);

// Store para saber si el usuario tiene perfil completo
export const userProfile = writable(null);

// Store para el estado de carga
export const authLoading = writable(true);

// Inicializar el listener de autenticación
if (browser) {
    onAuthStateChanged(auth, (currentUser) => {
        user.set(currentUser);
        authLoading.set(false);
    });
}
