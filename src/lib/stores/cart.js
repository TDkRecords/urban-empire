import { writable } from 'svelte/store';
import { db } from '../assets/js/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { auth } from '../assets/js/firebase';

function createCart() {
    const { subscribe, set, update } = writable([]);
    
    // Cargar el carrito desde Firebase
    async function loadCart() {
        if (!auth.currentUser) return [];
        
        const cartRef = doc(db, 'carshop', auth.currentUser.uid);
        const cartSnap = await getDoc(cartRef);
        
        if (cartSnap.exists()) {
            set(cartSnap.data().items || []);
        } else {
            set([]);
        }
    }
    
    // Añadir al carrito
    async function addToCart(product) {
        if (!auth.currentUser) {
            alert('Por favor inicia sesión para agregar productos al carrito');
            return;
        }
        
        let updatedItems;
        update((items) => {
            const existingItem = items.find(item => item.id === product.id);
            
            if (existingItem) {
                // Si el producto ya está en el carrito, aumentar cantidad si hay stock
                if (existingItem.quantity < (existingItem.stock || 999)) {
                    updatedItems = items.map(item => 
                        item.id === product.id 
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    alert('No hay más stock disponible');
                    updatedItems = items;
                }
            } else {
                // Si el producto no está en el carrito, añadirlo
                const newItem = {
                    ...product,
                    quantity: 1
                };
                updatedItems = [...items, newItem];
            }
            
            return updatedItems;
        });
        
        // Actualizar en Firebase después de actualizar el store
        if (updatedItems) {
            await updateCartInFirebase(updatedItems);
        }
    }
    
    // Actualizar cantidad de un producto
    async function updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) return;
        
        let updatedItems;
        update((items) => {
            const item = items.find(i => i.id === productId);
            if (item && newQuantity <= (item.stock || 999)) {
                updatedItems = items.map(i => 
                    i.id === productId 
                        ? { ...i, quantity: newQuantity }
                        : i
                );
                return updatedItems;
            }
            return items;
        });
        
        if (updatedItems) {
            await updateCartInFirebase(updatedItems);
        }
    }
    
    // Eliminar producto del carrito
    async function removeFromCart(productId) {
        let updatedItems;
        update((items) => {
            updatedItems = items.filter(item => item.id !== productId);
            return updatedItems;
        });
        
        if (updatedItems) {
            await updateCartInFirebase(updatedItems);
        }
    }
    
    // Actualizar carrito en Firebase
    async function updateCartInFirebase(items) {
        if (!auth.currentUser) return;
        
        const cartRef = doc(db, 'carshop', auth.currentUser.uid);
        await setDoc(cartRef, { items }, { merge: true });
    }
    
    // Vaciar carrito
    async function clearCart() {
        if (!auth.currentUser) return;
        
        const cartRef = doc(db, 'carshop', auth.currentUser.uid);
        await setDoc(cartRef, { items: [] }, { merge: true });
        set([]);
    }
    
    // Escuchar cambios en la autenticación
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadCart();
        } else {
            set([]);
        }
    });
    
    return {
        subscribe,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
    };
}

export const cart = createCart();
