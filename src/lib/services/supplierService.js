import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../assets/js/firebase';
import { writable, derived } from 'svelte/store';

// Store reactivo para proveedores
export const suppliers = writable([]);

// Store derivado para estadísticas de proveedores
export const supplierStats = derived(suppliers, ($suppliers) => {
    return {
        total: $suppliers.length,
        active: $suppliers.filter(s => s.activo).length,
        inactive: $suppliers.filter(s => !s.activo).length,
        totalProducts: $suppliers.reduce((sum, s) => sum + (s.productosAsociados || 0), 0)
    };
});

// Listener en tiempo real para proveedores
let unsubscribeSuppliers = null;

export function subscribeToSuppliers() {
    if (unsubscribeSuppliers) return;
    
    unsubscribeSuppliers = onSnapshot(
        collection(db, 'proveedores'),
        (snapshot) => {
            const suppliersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            suppliers.set(suppliersData);
        },
        (error) => {
            console.error('Error al escuchar cambios en proveedores:', error);
        }
    );
}

export function unsubscribeFromSuppliers() {
    if (unsubscribeSuppliers) {
        unsubscribeSuppliers();
        unsubscribeSuppliers = null;
    }
}

// Obtener todos los proveedores
export async function getSuppliers() {
    try {
        const querySnapshot = await getDocs(collection(db, 'proveedores'));
        const suppliersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return suppliersData;
    } catch (error) {
        console.error('Error al obtener los proveedores:', error);
        throw error;
    }
}

// Obtener un proveedor por ID
export async function getSupplierById(supplierId) {
    try {
        const docRef = doc(db, 'proveedores', supplierId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            console.log('No se encontró el proveedor');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        throw error;
    }
}

// Crear un nuevo proveedor
export async function createSupplier(supplierData) {
    try {
        const docRef = await addDoc(collection(db, 'proveedores'), {
            ...supplierData,
            fechaCreacion: new Date().toISOString(),
            activo: supplierData.activo !== undefined ? supplierData.activo : true,
            productosAsociados: supplierData.productosAsociados || 0
        });
        
        return docRef.id;
    } catch (error) {
        console.error('Error al crear el proveedor:', error);
        throw error;
    }
}

// Actualizar un proveedor
export async function updateSupplier(supplierId, supplierData) {
    try {
        const docRef = doc(db, 'proveedores', supplierId);
        await updateDoc(docRef, {
            ...supplierData,
            fechaActualizacion: new Date().toISOString()
        });
        
        return true;
    } catch (error) {
        console.error('Error al actualizar el proveedor:', error);
        throw error;
    }
}

// Eliminar un proveedor
export async function deleteSupplier(supplierId) {
    try {
        await deleteDoc(doc(db, 'proveedores', supplierId));
        return true;
    } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        throw error;
    }
}

// Obtener productos de un proveedor específico
export async function getProductsBySupplier(supplierId) {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const products = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(product => product.proveedorId === supplierId);
        
        return products;
    } catch (error) {
        console.error('Error al obtener productos del proveedor:', error);
        throw error;
    }
}
