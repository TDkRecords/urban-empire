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
        serverTimestamp,
    } from "firebase/firestore";
    import { db } from "$lib/assets/js/firebase";
    import { fade, fly, scale } from "svelte/transition";

    // Estado
    let productos = [];
    let loading = true;
    let error = null;
    let searchTerm = "";
    let selectedCategory = "all";
    let categories = [];
    let unsubscribe = null;

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
    };

    // Productos filtrados
    $: productosFiltrados = productos.filter((p) => {
        const matchesSearch =
            p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" ||
            (selectedCategory === "sin-categoria" && !p.categoria) ||
            p.categoria === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Actualizar categorías cuando cambien los productos
    $: if (productos.length) {
        updateCategories();
    }

    function updateCategories() {
        const unique = [
            ...new Set(productos.map((p) => p.categoria).filter(Boolean)),
        ];
        categories = ["Todas", "Sin categoría", ...unique.sort()];
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
    function loadProducts() {
        if (!browser || !checkAuth()) return;

        loading = true;
        error = null;

        try {
            const q = query(
                collection(db, "productos"),
                orderBy("nombre", "asc"),
            );

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    productos = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    loading = false;
                    console.log("Productos cargados:", productos.length);
                },
                (err) => {
                    console.error("Error al cargar productos:", err);
                    error = "Error al cargar los productos";
                    loading = false;
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
        };
    }

    // Guardar producto
    async function handleSubmit() {
        if (!formData.nombre.trim()) {
            alert("El nombre del producto es obligatorio");
            return;
        }

        if (formData.precio <= 0) {
            alert("El precio debe ser mayor a 0");
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
                alert("Producto actualizado exitosamente");
            } else {
                // Crear nuevo producto
                productData.fechaCreacion = serverTimestamp();
                await addDoc(collection(db, "productos"), productData);
                alert("Producto creado exitosamente");
            }

            closeModal();
        } catch (err) {
            console.error("Error al guardar producto:", err);
            error = "Error al guardar el producto";
            alert("Error al guardar el producto. Intente nuevamente.");
        } finally {
            formSubmitting = false;
        }
    }

    // Eliminar producto
    async function handleDelete(producto) {
        if (
            !confirm(
                `¿Está seguro de eliminar el producto "${producto.nombre}"?`,
            )
        ) {
            return;
        }

        try {
            await deleteDoc(doc(db, "productos", producto.id));
            alert("Producto eliminado exitosamente");
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            alert("Error al eliminar el producto");
        }
    }

    // Formatear moneda
    function formatCurrency(amount) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount || 0);
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
            class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        >
            <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                    <a
                        href="/admin-panel-2025"
                        class="btn btn-outline-secondary btn-sm"
                    >
                        <i class="bi bi-arrow-left me-1"></i> Dashboard
                    </a>
                </div>
                <h1 class="h3 mb-0">
                    <i class="bi bi-box-seam-fill me-2"></i>
                    Gestión de Productos
                </h1>
                {#if !loading}
                    <p class="text-muted mb-0 mt-1">
                        {productos.length}
                        {productos.length === 1 ? "producto" : "productos"} registrados
                    </p>
                {/if}
            </div>
            <div class="d-flex gap-2">
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
                    <i class="bi bi-plus-lg me-1"></i> Nuevo Producto
                </button>
            </div>
        </div>

        <!-- Filtros -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-8">
                        <div class="input-group">
                            <span
                                class="input-group-text bg-white border-end-0"
                            >
                                <i class="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                class="form-control border-start-0"
                                placeholder="Buscar por nombre o descripción..."
                                bind:value={searchTerm}
                            />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select
                            class="form-select"
                            bind:value={selectedCategory}
                        >
                            {#each categories as category}
                                <option
                                    value={category === "Todas"
                                        ? "all"
                                        : category === "Sin categoría"
                                          ? "sin-categoria"
                                          : category}
                                >
                                    {category}
                                </option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        </div>

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
            <div
                class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4"
            >
                {#each productosFiltrados as producto, i (producto.id)}
                    <div
                        class="col"
                        in:fly={{ y: 20, duration: 300, delay: i * 30 }}
                    >
                        <div class="card h-100 shadow-sm product-card">
                            <!-- Imagen -->
                            <div class="product-image-wrapper">
                                {#if producto.imagen}
                                    <img
                                        src={producto.imagen}
                                        class="card-img-top"
                                        alt={producto.nombre}
                                        on:error={(e) => {
                                            e.target.src =
                                                "https://via.placeholder.com/300x200?text=Sin+imagen";
                                        }}
                                    />
                                {:else}
                                    <div class="product-placeholder">
                                        <i class="bi bi-image"></i>
                                    </div>
                                {/if}
                                <!-- Badge de stock -->
                                {#if producto.stock <= 5 && producto.stock > 0}
                                    <span
                                        class="badge bg-warning text-dark position-absolute top-0 end-0 m-2"
                                    >
                                        ¡Pocas unidades!
                                    </span>
                                {:else if producto.stock === 0}
                                    <span
                                        class="badge bg-danger position-absolute top-0 end-0 m-2"
                                    >
                                        Agotado
                                    </span>
                                {/if}
                            </div>

                            <!-- Contenido -->
                            <div class="card-body d-flex flex-column">
                                <!-- Categoría -->
                                {#if producto.categoria}
                                    <span
                                        class="badge bg-secondary mb-2 align-self-start"
                                    >
                                        {producto.categoria}
                                    </span>
                                {/if}

                                <!-- Nombre -->
                                <h5 class="card-title fw-bold mb-2">
                                    {producto.nombre}
                                </h5>

                                <!-- Descripción -->
                                {#if producto.descripcion}
                                    <p
                                        class="card-text text-muted small mb-3 flex-grow-1 text-truncate-3"
                                    >
                                        {producto.descripcion}
                                    </p>
                                {/if}

                                <!-- Precios y Stock -->
                                <div class="mb-3">
                                    <div
                                        class="d-flex justify-content-between align-items-center mb-1"
                                    >
                                        <small class="text-muted">Costo:</small>
                                        <small
                                            >{formatCurrency(
                                                producto.costoProd,
                                            )}</small
                                        >
                                    </div>
                                    <div
                                        class="d-flex justify-content-between align-items-center mb-1"
                                    >
                                        <small class="text-muted">Precio:</small
                                        >
                                        <strong class="text-success"
                                            >{formatCurrency(
                                                producto.precio,
                                            )}</strong
                                        >
                                    </div>
                                    <div
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        <small class="text-muted">Stock:</small>
                                        <span
                                            class="badge bg-{producto.stock > 10
                                                ? 'success'
                                                : producto.stock > 0
                                                  ? 'warning text-dark'
                                                  : 'danger'}"
                                        >
                                            {producto.stock} unidades
                                        </span>
                                    </div>
                                </div>

                                <!-- Acciones -->
                                <div class="d-flex gap-2">
                                    <button
                                        class="btn btn-sm btn-outline-primary flex-grow-1"
                                        on:click={() => openEditModal(producto)}
                                    >
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button
                                        aria-label="Eliminar"
                                        class="btn btn-sm btn-outline-danger"
                                        on:click={() => handleDelete(producto)}
                                    >
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <div class="mt-4 text-muted small">
                Mostrando {productosFiltrados.length} de {productos.length} productos
            </div>
        {/if}
    </div>
</div>

<!-- Modal -->
{#if showModal}
    <div class="modal fade show d-block" tabindex="-1" role="dialog" in:fade>
        <div
            class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        >
            <div class="modal-content" in:fly={{ y: -50, duration: 300 }}>
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i
                            class="bi bi-{editingProducto
                                ? 'pencil'
                                : 'plus-circle'} me-2"
                        ></i>
                        {editingProducto ? "Editar Producto" : "Nuevo Producto"}
                    </h5>
                    <button
                        aria-label="Cerrar"
                        type="button"
                        class="btn-close btn-close-white"
                        on:click={closeModal}
                    ></button>
                </div>
                <form on:submit|preventDefault={handleSubmit}>
                    <div class="modal-body">
                        <div class="row g-3">
                            <!-- Nombre -->
                            <div class="col-12">
                                <label
                                    for="nombre"
                                    class="form-label fw-semibold"
                                >
                                    Nombre del Producto *
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="nombre"
                                    bind:value={formData.nombre}
                                    placeholder="Ej: Camiseta Urban Classic"
                                    required
                                />
                            </div>

                            <!-- Descripción -->
                            <div class="col-12">
                                <label
                                    for="descripcion"
                                    class="form-label fw-semibold"
                                >
                                    Descripción
                                </label>
                                <textarea
                                    class="form-control"
                                    id="descripcion"
                                    rows="3"
                                    bind:value={formData.descripcion}
                                    placeholder="Describe el producto..."
                                ></textarea>
                            </div>

                            <!-- Categoría -->
                            <div class="col-md-6">
                                <label
                                    for="categoria"
                                    class="form-label fw-semibold"
                                >
                                    Categoría
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="categoria"
                                    bind:value={formData.categoria}
                                    placeholder="Ej: Camisetas"
                                    list="categorias"
                                />
                                <datalist id="categorias">
                                    {#each categories.filter((c) => c !== "Todas" && c !== "Sin categoría") as cat}
                                        <option value={cat}></option>
                                    {/each}
                                </datalist>
                            </div>

                            <!-- Stock -->
                            <div class="col-md-6">
                                <label
                                    for="stock"
                                    class="form-label fw-semibold"
                                >
                                    Stock *
                                </label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="stock"
                                    bind:value={formData.stock}
                                    min="0"
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <!-- Costo de Producción -->
                            <div class="col-md-6">
                                <label
                                    for="costoProd"
                                    class="form-label fw-semibold"
                                >
                                    Costo de Producción
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input
                                        type="number"
                                        class="form-control"
                                        id="costoProd"
                                        bind:value={formData.costoProd}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <!-- Precio de Venta -->
                            <div class="col-md-6">
                                <label
                                    for="precio"
                                    class="form-label fw-semibold"
                                >
                                    Precio de Venta *
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input
                                        type="number"
                                        class="form-control"
                                        id="precio"
                                        bind:value={formData.precio}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <!-- URL de Imagen -->
                            <div class="col-12">
                                <label
                                    for="imagen"
                                    class="form-label fw-semibold"
                                >
                                    URL de la Imagen
                                </label>
                                <input
                                    type="url"
                                    class="form-control"
                                    id="imagen"
                                    bind:value={formData.imagen}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                {#if formData.imagen}
                                    <div class="mt-2">
                                        <small class="text-muted"
                                            >Vista previa:</small
                                        >
                                        <img
                                            src={formData.imagen}
                                            alt="Vista previa"
                                            class="img-thumbnail mt-1"
                                            style="max-height: 150px;"
                                            on:error={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/300x200?text=Error+al+cargar";
                                            }}
                                        />
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            on:click={closeModal}
                        >
                            <i class="bi bi-x-lg me-1"></i> Cancelar
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={formSubmitting}
                        >
                            {#if formSubmitting}
                                <span
                                    class="spinner-border spinner-border-sm me-1"
                                ></span>
                                Guardando...
                            {:else}
                                <i class="bi bi-save me-1"></i>
                                {editingProducto ? "Actualizar" : "Guardar"}
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal-backdrop fade show"></div>
{/if}

<style>
    .product-card {
        transition: all 0.3s ease;
        border: none;
        border-radius: 12px;
        overflow: hidden;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
    }

    .product-image-wrapper {
        position: relative;
        height: 200px;
        overflow: hidden;
        background: #f8f9fa;
    }

    .product-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        color: #6c757d;
        font-size: 3rem;
    }

    .text-truncate-3 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card {
        border-radius: 12px;
    }

    .modal.show {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        border: none;
        border-radius: 12px;
        overflow: hidden;
    }

    .modal-header {
        border-bottom: none;
    }

    .modal-footer {
        border-top: 1px solid #dee2e6;
    }

    .badge {
        font-size: 0.75rem;
        padding: 0.35rem 0.65rem;
    }
</style>
