import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../assets/js/firebase';

// Obtener todos los productos
async function getProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return products;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
}

// Obtener un producto por ID
async function getProductById(productId) {
    try {
        const docRef = doc(db, "productos", productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            console.log("No se encontró el producto");
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        throw error;
    }
}

export { getProducts, getProductById };
