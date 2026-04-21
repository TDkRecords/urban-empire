<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { getCurrentUser, isAuthenticated } from "$lib/utils/auth";
    import {
        collection,
        getDocs,
        addDoc,
        updateDoc,
        deleteDoc,
        doc,
        query,
        orderBy,
        onSnapshot,
        setDoc,
        serverTimestamp,
    } from "firebase/firestore";
    import { db } from "$lib/assets/js/firebase";
    import { fade, fly, scale } from "svelte/transition";
    import {
        success as notifySuccess,
        error as notifyError,
        confirm as notifyConfirm,
    } from "$lib/utils/notify";

    // Servicios
    import {
        getTags,
        createTag,
        updateTag,
        deleteTag,
        tags as tagsStore,
    } from "$lib/services/tagService";

    // Componentes
    import ProductSearchFilter from "./modules/ProductSearchFilter.svelte";
    import ProductGrid from "./modules/ProductGrid.svelte";
    import ProductFormModal from "./modules/ProductFormModal.svelte";

    // Estado
    let productos = [];
    let deletedProducts = [];
    let loading = true;
    let error = null;
    let searchTerm = "";
    let selectedCategory = "all";
    let unsubscribe = null;
    let unsubscribeDeleted = null;
    let unsubscribeAuth = null;
    let selectedTag = "all";

    // Modal y formulario
    let showModal = false;
    let editingProducto = null;
    let formSubmitting = false;
    let formData = {
        nombre: "",
        descripcion: "",
        costoProd: 0,
        precio: 0,
        stock: 0,
        categoria: "",
        imagen: "",
        etiquetas: [],
    };

    // Productos filtrados
    $: productosFiltrados = productos.filter((p) => {
        const matchesSearch =
            p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTag =
            selectedTag === "all" ||
            (selectedTag === "sin-etiqueta" && !p.etiquetas) ||
            (p.etiquetas &&
                p.etiquetas
                    .toLowerCase()
                    .split(",")
                    .map((t) => t.trim())
                    .includes(selectedTag.toLowerCase()));

        return matchesSearch && matchesTag;
    });

    $: deletedProductsFiltrados = deletedProducts.filter((p) => {
        const matchesSearch =
            p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Actualizar categorías cuando cambien los productos
    $: if (productos.length) {
        updateCategories();
    }

    // Verificar autenticación
    function checkAuth() {
        if (!browser) return false;
        if (!isAuthenticated()) {
            goto("/admin-panel-2025/login");
            return false;
        }
        return true;
    }

    // Cargar productos con onSnapshot (tiempo real)
    async function loadProducts() {
        if (!browser || !checkAuth()) return;

        loading = true;
        error = null;

        try {
            // Las etiquetas se cargan automáticamente por el store
            const q = query(collection(db, "productos"));
            const qDeleted = query(collection(db, "productos_eliminados"));

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    console.log(
                        "Productos snapshot recibido:",
                        snapshot.docs.length,
                        "documentos",
                    );
                    productos = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log("Productos cargados:", productos.length);
                    loading = false;
                },
                (err) => {
                    console.error("Error al cargar productos:", err);
                    error = "Error al cargar los productos";
                    loading = false;
                },
            );

            unsubscribeDeleted = onSnapshot(
                qDeleted,
                (snapshot) => {
                    deletedProducts = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                },
                (err) => {
                    console.error("Error al cargar productos eliminados:", err);
                },
            );
        } catch (err) {
            console.error("Error al configurar listener:", err);
            error = "Error al configurar la conexión con la base de datos";
            loading = false;
        }
    }

    // Abrir modal para crear
    function openCreateModal() {
        editingProducto = null;
        formData = {
            nombre: "",
            descripcion: "",
            costoProd: 0,
            precio: 0,
            stock: 0,
            categoria: "",
            imagen: "",
            etiquetas: [],
        };
        showModal = true;
    }

    // Abrir modal para editar
    function openEditModal(producto) {
        editingProducto = producto;
        formData = {
            nombre: producto.nombre || "",
            descripcion: producto.descripcion || "",
            costoProd: producto.costoProd || 0,
            precio: producto.precio || 0,
            stock: producto.stock || 0,
            categoria: producto.categoria || "",
            imagen: producto.imagen || "",
            etiquetas: producto.etiquetas || [],
        };
        showModal = true;
    }

    // Cerrar modal
    function closeModal() {
        showModal = false;
        editingProducto = null;
        formData = {
            nombre: "",
            descripcion: "",
            costoProd: 0,
            precio: 0,
            stock: 0,
            categoria: "",
            imagen: "",
            etiquetas: [],
        };
    }

    // Guardar producto
    async function handleSubmit() {
        if (!formData.nombre.trim()) {
            error("El nombre del producto es obligatorio");
            return;
        }

        if (formData.precio <= 0) {
            error("El precio debe ser mayor a 0");
            return;
        }

        formSubmitting = true;
        error = null;

        try {
            const productData = {
                ...formData,
                costoProd: parseFloat(formData.costoProd) || 0,
                precio: parseFloat(formData.precio) || 0,
                stock: parseInt(formData.stock) || 0,
                fechaActualizacion: serverTimestamp(),
            };

            if (editingProducto) {
                // Actualizar producto existente
                await updateDoc(
                    doc(db, "productos", editingProducto.id),
                    productData,
                );
                notifySuccess("Producto actualizado exitosamente");
            } else {
                // Crear nuevo producto
                productData.fechaCreacion = serverTimestamp();
                await addDoc(collection(db, "productos"), productData);
                notifySuccess("Producto creado exitosamente");
            }

            closeModal();
        } catch (err) {
            console.error("Error al guardar producto:", err);
            error = "Error al guardar el producto";
            error("Error al guardar el producto. Intente nuevamente.");
        } finally {
            formSubmitting = false;
        }
    }

    // Eliminar producto (mover a sección de eliminados)
    async function handleDelete(producto) {
        notifyConfirm(
            `¿Está seguro de eliminar el producto "${producto.nombre}"?`,
            async () => {
                try {
                    const { id, ...productData } = producto;
                    await setDoc(doc(db, "productos_eliminados", producto.id), {
                        ...productData,
                        deletedAt: serverTimestamp(),
                    });
                    await deleteDoc(doc(db, "productos", producto.id));
                    notifySuccess("Producto movido a eliminados");
                } catch (err) {
                    console.error("Error al eliminar producto:", err);
                    notifyError("Error al eliminar el producto");
                }
            },
            () => {
                // Cancelado por el usuario
            },
        );
    }

    // Restaurar producto eliminado
    async function handleRestore(producto) {
        notifyConfirm(
            `¿Deseas restaurar el producto "${producto.nombre}"?`,
            async () => {
                try {
                    const { id, deletedAt, ...productData } = producto;
                    await setDoc(doc(db, "productos", producto.id), {
                        ...productData,
                        fechaActualizacion: serverTimestamp(),
                    });
                    await deleteDoc(
                        doc(db, "productos_eliminados", producto.id),
                    );
                    notifySuccess("Producto restaurado correctamente");
                } catch (err) {
                    console.error("Error al restaurar producto:", err);
                    notifyError("Error al restaurar el producto");
                }
            },
            () => {
                // Cancelado por el usuario
            },
        );
    }

    // Lifecycle
    onMount(() => {
        if (!browser) return;
        if (checkAuth()) {
            loadProducts();
        }
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
        if (unsubscribeDeleted) {
            unsubscribeDeleted();
        }
    });
</script>

<svelte:head>
    <title>Productos - Panel de Administración</title>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
    />
</svelte:head>

<div class="min-vh-100 bg-light">
    <div class="container py-4">
        <!-- Header -->
        <div
            class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3"
        >
            <div>
                <h1 class="h3 mb-0">
                    <i class="bi bi-box-seam-fill me-2 text-primary"></i>
                    Gestión de Productos
                </h1>
                {#if !loading}
                    <p class="text-muted mb-0 mt-1">
                        {productos.length}
                        {productos.length === 1 ? "producto" : "productos"} registrados
                    </p>
                {/if}
            </div>
            <div class="d-flex flex-wrap gap-2">
                <button
                    aria-label="Recargar"
                    class="btn btn-outline-secondary"
                    on:click={loadProducts}
                    disabled={loading}
                    title="Recargar"
                >
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-primary" on:click={openCreateModal}>
                    <i class="bi bi-plus-lg me-1"></i>
                    <span class="d-none d-sm-inline">Nuevo Producto</span>
                    <span class="d-inline d-sm-none">Nuevo</span>
                </button>
            </div>
        </div>

        <!-- Filtros -->
        <ProductSearchFilter
            bind:searchTerm
            bind:selectedTag
            tags={$tagsStore}
        />

        <!-- Mensaje de error -->
        {#if error}
            <div
                class="alert alert-danger d-flex align-items-center"
                role="alert"
                in:fade
            >
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
            </div>
        {/if}

        <!-- Loading -->
        {#if loading}
            <div class="text-center py-5" in:fade>
                <div
                    class="spinner-border text-primary"
                    style="width: 3rem; height: 3rem;"
                >
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">Cargando productos...</p>
            </div>

            <!-- Sin productos -->
        {:else if productos.length === 0}
            <div class="card shadow-sm" in:fade>
                <div class="card-body text-center py-5">
                    <i
                        class="bi bi-box-seam text-muted"
                        style="font-size: 4rem; opacity: 0.5;"
                    ></i>
                    <h3 class="h4 mt-4">No hay productos registrados</h3>
                    <p class="text-muted mb-4">
                        Comienza agregando tu primer producto
                    </p>
                    <button class="btn btn-primary" on:click={openCreateModal}>
                        <i class="bi bi-plus-lg me-1"></i> Agregar Producto
                    </button>
                </div>
            </div>

            <!-- Sin resultados de búsqueda -->
        {:else if productosFiltrados.length === 0}
            <div class="card shadow-sm" in:fade>
                <div class="card-body text-center py-5">
                    <i
                        class="bi bi-search text-muted"
                        style="font-size: 4rem; opacity: 0.5;"
                    ></i>
                    <h3 class="h4 mt-4">No se encontraron resultados</h3>
                    <p class="text-muted">
                        Intenta con otros términos de búsqueda
                    </p>
                </div>
            </div>

            <!-- Grid de productos -->
        {:else}
            <ProductGrid
                productos={productosFiltrados}
                tags={$tagsStore}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            <div class="mt-4 text-muted small text-center text-lg-start">
                Mostrando {productosFiltrados.length} de {productos.length} productos
            </div>

            {#if deletedProducts.length > 0}
                <div class="mt-5">
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3"
                    >
                        <div>
                            <h2 class="h5 mb-1">Productos eliminados</h2>
                            <p class="text-muted mb-0">
                                {deletedProducts.length} producto{deletedProducts.length ===
                                1
                                    ? ""
                                    : "s"} en eliminados
                            </p>
                        </div>
                        <button
                            aria-label="Recargar eliminados"
                            class="btn btn-outline-secondary"
                            on:click={loadProducts}
                        >
                            <i class="bi bi-arrow-clockwise"></i>
                            <span class="d-none d-sm-inline ms-1"
                                >Recargar eliminados</span
                            >
                        </button>
                    </div>

                    <ProductGrid
                        productos={deletedProductsFiltrados}
                        tags={$tagsStore}
                        onRestore={handleRestore}
                        isDeletedList={true}
                    />
                </div>
            {/if}
        {/if}
    </div>
</div>

<!-- Modal -->
<ProductFormModal
    bind:showModal
    bind:editingProducto
    bind:formData
    bind:formSubmitting
    tags={$tagsStore}
    onClose={closeModal}
    onSubmit={handleSubmit}
/>
