<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import {
        collection,
        getDocs,
        query,
        orderBy,
        limit,
        startAfter,
    } from "firebase/firestore";
    import { db } from "$lib/assets/js/firebase";
    import ProductsSection from "$lib/components/admin/ProductsSection.svelte";

    // Estado
    let productos = [];
    let loading = true;
    let error = null;
    const itemsPerPage = 10;
    let currentPage = 1;
    let totalItems = 0;
    let lastVisible = null;
    let hasNextPage = false;

    // Cargar productos
    async function loadProducts(page = 1) {
        try {
            loading = true;
            const productsRef = collection(db, "productos");
            let q = query(productsRef, orderBy("nombre"), limit(itemsPerPage));

            // Si no es la primera página, usar startAfter para paginación
            if (page > 1 && lastVisible) {
                q = query(
                    productsRef,
                    orderBy("nombre"),
                    startAfter(lastVisible),
                    limit(itemsPerPage),
                );
            }

            const snapshot = await getDocs(q);

            // Obtener el último documento para la paginación
            const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
            lastVisible = lastVisibleDoc;

            // Verificar si hay más páginas
            const nextSnapshot = await getDocs(
                query(
                    productsRef,
                    orderBy("nombre"),
                    startAfter(lastVisibleDoc),
                    limit(1),
                ),
            );
            hasNextPage = !nextSnapshot.empty;

            // Mapear documentos
            productos = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Actualizar la URL
            const url = new URL(window.location);
            url.searchParams.set("page", page);
            window.history.pushState({}, "", url);
        } catch (err) {
            console.error("Error loading products:", err);
            error = "Error al cargar los productos";
        } finally {
            loading = false;
        }
    }

    // Navegación de páginas
    function goToPage(page) {
        if (page < 1) return;
        currentPage = page;
        loadProducts(page);
    }

    // Inicializar
    onMount(() => {
        // Obtener página actual de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = parseInt(urlParams.get("page")) || 1;
        currentPage = pageParam;

        // Cargar productos iniciales
        loadProducts(currentPage);
    });
</script>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Productos</h1>
        <a
            href="/admin-panel-2025/dashboard/products/new"
            class="btn btn-primary"
        >
            <i class="bi bi-plus-lg me-2"></i>Nuevo Producto
        </a>
    </div>

    {#if error}
        <div class="alert alert-danger">{error}</div>
    {/if}

    <ProductsSection
        {productos}
        {loading}
        handleDeleteProduct={async (producto) => {
            // Implementar lógica de eliminación
            console.log("Eliminar producto:", producto);
        }}
    />

    <!-- Paginación -->
    {#if !loading && productos.length > 0}
        <nav aria-label="Navegación de productos" class="mt-4">
            <ul class="pagination justify-content-center">
                <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
                    <button
                        class="page-link"
                        on:click={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                </li>

                <li class="page-item">
                    <span class="page-link">Página {currentPage}</span>
                </li>

                <li class="page-item {!hasNextPage ? 'disabled' : ''}">
                    <button
                        class="page-link"
                        on:click={() => goToPage(currentPage + 1)}
                        disabled={!hasNextPage}
                    >
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
    {/if}
</div>
