import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../assets/js/firebase';
import { writable, derived } from 'svelte/store';

// Store reactivo para etiquetas
export const tags = writable([]);

// Inicializar el listener automáticamente
let unsubscribeTags = null;

function initializeTagsListener() {
    if (unsubscribeTags) return;

    try {
        unsubscribeTags = onSnapshot(
            collection(db, 'etiquetas'),
            (snapshot) => {
                const tagsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                tags.set(tagsData);
            },
            (error) => {
                console.error('Error al escuchar cambios en etiquetas:', error);
            }
        );
    } catch (error) {
        console.error('Error al configurar listener de etiquetas:', error);
    }
}

// Inicializar automáticamente
if (typeof window !== 'undefined') {
    initializeTagsListener();
}

// Store derivado para estadísticas de etiquetas
export const tagStats = derived(tags, ($tags) => {
    return {
        total: $tags.length,
        active: $tags.filter(t => t.activo).length,
        inactive: $tags.filter(t => !t.activo).length
    };
});

// Obtener todas las etiquetas
export async function getTags() {
    try {
        const querySnapshot = await getDocs(collection(db, 'etiquetas'));
        const tagsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return tagsData;
    } catch (error) {
        console.error('Error al obtener las etiquetas:', error);
        throw error;
    }
}

// Obtener una etiqueta por ID
export async function getTagById(tagId) {
    try {
        const docRef = doc(db, 'etiquetas', tagId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener la etiqueta:', error);
        throw error;
    }
}

// Crear una nueva etiqueta
export async function createTag(tagData) {
    try {
        const docRef = await addDoc(collection(db, 'etiquetas'), {
            ...tagData,
            fechaCreacion: new Date().toISOString(),
            activo: tagData.activo !== undefined ? tagData.activo : true
        });

        return docRef.id;
    } catch (error) {
        console.error('Error al crear la etiqueta:', error);
        throw error;
    }
}

// Actualizar una etiqueta
export async function updateTag(tagId, tagData) {
    try {
        const docRef = doc(db, 'etiquetas', tagId);
        await updateDoc(docRef, {
            ...tagData,
            fechaActualizacion: new Date().toISOString()
        });

        return true;
    } catch (error) {
        console.error('Error al actualizar la etiqueta:', error);
        throw error;
    }
}

// Eliminar una etiqueta
export async function deleteTag(tagId) {
    try {
        await deleteDoc(doc(db, 'etiquetas', tagId));
        return true;
    } catch (error) {
        console.error('Error al eliminar la etiqueta:', error);
        throw error;
    }
}