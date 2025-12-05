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
    import { fade, fly } from "svelte/transition";

    // Estado
    let proveedores = [];
    let loading = true;
    let error = null;
    let searchTerm = "";
    let unsubscribe = null;

    // Modal y formulario
    let showModal = false;
    let editingProveedor = null;
    let formSubmitting = false;
    let formData = {
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        contacto: "",
        activo: true,
    };

    // Proveedores filtrados
    $: proveedoresFiltrados = proveedores.filter((p) => {
        const search = searchTerm.toLowerCase();
        return (
            p.nombre?.toLowerCase().includes(search) ||
            p.email?.toLowerCase().includes(search) ||
            p.telefono?.toLowerCase().includes(search) ||
            p.contacto?.toLowerCase().includes(search)
        );
    });

    // Verificar autenticación
    function checkAuth() {
        if (!browser) return false;
        if (!isAuthenticated()) {
            goto("/admin-panel-2025/login");
            return false;
        }
        return true;
    }

    // Cargar proveedores con onSnapshot (tiempo real)
    function loadSuppliers() {
        if (!browser || !checkAuth()) return;

        loading = true;
        error = null;

        try {
            const q = query(
                collection(db, "proveedores"),
                orderBy("nombre", "asc"),
            );

            // Suscribirse a cambios en tiempo real
            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    proveedores = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    loading = false;
                    console.log("Proveedores cargados:", proveedores.length);
                },
                (err) => {
                    console.error("Error al cargar proveedores:", err);
                    error = "Error al cargar los proveedores";
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
        editingProveedor = null;
        formData = {
            nombre: "",
            email: "",
            telefono: "",
            direccion: "",
            contacto: "",
            activo: true,
        };
        showModal = true;
    }

    // Abrir modal para editar
    function openEditModal(proveedor) {
        editingProveedor = proveedor;
        formData = {
            nombre: proveedor.nombre || "",
            email: proveedor.email || "",
            telefono: proveedor.telefono || "",
            direccion: proveedor.direccion || "",
            contacto: proveedor.contacto || "",
            activo: proveedor.activo !== undefined ? proveedor.activo : true,
        };
        showModal = true;
    }

    // Cerrar modal
    function closeModal() {
        showModal = false;
        editingProveedor = null;
        formData = {
            nombre: "",
            email: "",
            telefono: "",
            direccion: "",
            contacto: "",
            activo: true,
        };
    }

    // Guardar proveedor
    async function handleSubmit() {
        if (!formData.nombre.trim()) {
            alert("El nombre del proveedor es obligatorio");
            return;
        }

        formSubmitting = true;
        error = null;

        try {
            const providerData = {
                ...formData,
                fechaActualizacion: serverTimestamp(),
            };

            if (editingProveedor) {
                // Actualizar proveedor existente
                await updateDoc(
                    doc(db, "proveedores", editingProveedor.id),
                    providerData,
                );
                alert("Proveedor actualizado exitosamente");
            } else {
                // Crear nuevo proveedor
                providerData.fechaCreacion = serverTimestamp();
                await addDoc(collection(db, "proveedores"), providerData);
                alert("Proveedor creado exitosamente");
            }

            closeModal();
        } catch (err) {
            console.error("Error al guardar proveedor:", err);
            error = "Error al guardar el proveedor";
            alert("Error al guardar el proveedor. Intente nuevamente.");
        } finally {
            formSubmitting = false;
        }
    }

    // Eliminar proveedor
    async function handleDelete(proveedor) {
        if (
            !confirm(
                `¿Está seguro de eliminar el proveedor "${proveedor.nombre}"?`,
            )
        ) {
            return;
        }

        try {
            await deleteDoc(doc(db, "proveedores", proveedor.id));
            alert("Proveedor eliminado exitosamente");
        } catch (err) {
            console.error("Error al eliminar proveedor:", err);
            alert("Error al eliminar el proveedor");
        }
    }

    // Alternar estado activo/inactivo
    async function toggleStatus(proveedor) {
        try {
            await updateDoc(doc(db, "proveedores", proveedor.id), {
                activo: !proveedor.activo,
                fechaActualizacion: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            alert("Error al cambiar el estado del proveedor");
        }
    }

    // Lifecycle
    onMount(() => {
        if (!browser) return;
        if (checkAuth()) {
            loadSuppliers();
        }
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });
</script>

<svelte:head>
    <title>Proveedores - Panel de Administración</title>
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
                    <i class="bi bi-people-fill me-2"></i>
                    Gestión de Proveedores
                </h1>
                {#if !loading}
                    <p class="text-muted mb-0 mt-1">
                        {proveedores.length}
                        {proveedores.length === 1 ? "proveedor" : "proveedores"}
                        registrados
                    </p>
                {/if}
            </div>
            <div class="d-flex gap-2">
                <button
                    class="btn btn-outline-secondary"
                    on:click={loadSuppliers}
                    disabled={loading}
                    title="Recargar"
                    aria-label="Recargar"
                >
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button
                    class="btn btn-primary"
                    on:click={openCreateModal}
                    aria-label="Nuevo Proveedor"
                >
                    <i class="bi bi-plus-lg me-1"></i> Nuevo Proveedor
                </button>
            </div>
        </div>

        <!-- Buscador -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search text-muted"></i>
                    </span>
                    <input
                        type="text"
                        class="form-control border-start-0"
                        placeholder="Buscar por nombre, email, teléfono o contacto..."
                        bind:value={searchTerm}
                    />
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
                <p class="mt-3 text-muted">Cargando proveedores...</p>
            </div>

            <!-- Sin proveedores -->
        {:else if proveedores.length === 0}
            <div class="card shadow-sm" in:fade>
                <div class="card-body text-center py-5">
                    <i
                        class="bi bi-people text-muted"
                        style="font-size: 4rem; opacity: 0.5;"
                    ></i>
                    <h3 class="h4 mt-4">No hay proveedores registrados</h3>
                    <p class="text-muted mb-4">
                        Comienza agregando tu primer proveedor
                    </p>
                    <button class="btn btn-primary" on:click={openCreateModal}>
                        <i class="bi bi-plus-lg me-1"></i> Agregar Proveedor
                    </button>
                </div>
            </div>

            <!-- Sin resultados de búsqueda -->
        {:else if proveedoresFiltrados.length === 0}
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

            <!-- Tabla de proveedores -->
        {:else}
            <div class="card shadow-sm" in:fade>
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-3">Proveedor</th>
                                <th>Contacto</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                                <th class="text-end pe-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each proveedoresFiltrados as proveedor (proveedor.id)}
                                <tr in:fly={{ y: 20, duration: 300 }}>
                                    <td class="ps-3">
                                        <div
                                            class="d-flex align-items-center gap-2"
                                        >
                                            <div class="avatar-circle">
                                                <i class="bi bi-building"></i>
                                            </div>
                                            <div>
                                                <div class="fw-semibold">
                                                    {proveedor.nombre}
                                                </div>
                                                {#if proveedor.direccion}
                                                    <small class="text-muted"
                                                        >{proveedor.direccion}</small
                                                    >
                                                {/if}
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        >{proveedor.contacto ||
                                            "No especificado"}</td
                                    >
                                    <td>
                                        {#if proveedor.email}
                                            <a
                                                href="mailto:{proveedor.email}"
                                                class="text-decoration-none"
                                            >
                                                {proveedor.email}
                                            </a>
                                        {:else}
                                            <span class="text-muted"
                                                >No especificado</span
                                            >
                                        {/if}
                                    </td>
                                    <td>
                                        {#if proveedor.telefono}
                                            <a
                                                href="tel:{proveedor.telefono}"
                                                class="text-decoration-none"
                                            >
                                                {proveedor.telefono}
                                            </a>
                                        {:else}
                                            <span class="text-muted"
                                                >No especificado</span
                                            >
                                        {/if}
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-{proveedor.activo
                                                ? 'success'
                                                : 'secondary'}"
                                        >
                                            {proveedor.activo
                                                ? "Activo"
                                                : "Inactivo"}
                                        </span>
                                    </td>
                                    <td class="text-end pe-3">
                                        <div class="btn-group btn-group-sm">
                                            <button
                                                aria-label="Editar"
                                                class="btn btn-outline-primary"
                                                on:click={() =>
                                                    openEditModal(proveedor)}
                                                title="Editar"
                                            >
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                aria-label="Activar/Desactivar"
                                                class="btn btn-outline-{proveedor.activo
                                                    ? 'warning'
                                                    : 'success'}"
                                                on:click={() =>
                                                    toggleStatus(proveedor)}
                                                title={proveedor.activo
                                                    ? "Desactivar"
                                                    : "Activar"}
                                            >
                                                <i
                                                    class="bi bi-{proveedor.activo
                                                        ? 'pause'
                                                        : 'play'}-circle"
                                                ></i>
                                            </button>
                                            <button
                                                aria-label="Eliminar"
                                                class="btn btn-outline-danger"
                                                on:click={() =>
                                                    handleDelete(proveedor)}
                                                title="Eliminar"
                                            >
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-3 text-muted small">
                Mostrando {proveedoresFiltrados.length} de {proveedores.length} proveedores
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
                <div class="modal-header bg-gradient-success text-white">
                    <h5 class="modal-title">
                        <i
                            class="bi bi-{editingProveedor
                                ? 'pencil'
                                : 'plus-circle'} me-2"
                        ></i>
                        {editingProveedor
                            ? "Editar Proveedor"
                            : "Nuevo Proveedor"}
                    </h5>
                    <button
                        type="button"
                        class="btn-close btn-close-white"
                        on:click={closeModal}
                        aria-label="Cerrar"
                    ></button>
                </div>
                <form on:submit|preventDefault={handleSubmit}>
                    <div class="modal-body">
                        <div
                            class="alert alert-info d-flex align-items-center mb-4"
                        >
                            <i class="bi bi-info-circle-fill me-2"></i>
                            <small
                                >Los campos marcados con * son obligatorios</small
                            >
                        </div>

                        <div class="row g-3">
                            <!-- Nombre -->
                            <div class="col-md-6">
                                <label
                                    for="nombre"
                                    class="form-label fw-semibold"
                                >
                                    <i class="bi bi-building me-1"></i>
                                    Nombre del Proveedor *
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="nombre"
                                    bind:value={formData.nombre}
                                    placeholder="Ej: Textiles del Valle"
                                    required
                                />
                            </div>

                            <!-- Persona de Contacto -->
                            <div class="col-md-6">
                                <label
                                    for="contacto"
                                    class="form-label fw-semibold"
                                >
                                    <i class="bi bi-person me-1"></i>
                                    Persona de Contacto
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="contacto"
                                    bind:value={formData.contacto}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>

                            <!-- Email -->
                            <div class="col-md-6">
                                <label
                                    for="email"
                                    class="form-label fw-semibold"
                                >
                                    <i class="bi bi-envelope me-1"></i>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    class="form-control"
                                    id="email"
                                    bind:value={formData.email}
                                    placeholder="ejemplo@email.com"
                                />
                            </div>

                            <!-- Teléfono -->
                            <div class="col-md-6">
                                <label
                                    for="telefono"
                                    class="form-label fw-semibold"
                                >
                                    <i class="bi bi-telephone me-1"></i>
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    class="form-control"
                                    id="telefono"
                                    bind:value={formData.telefono}
                                    placeholder="+57 300 123 4567"
                                />
                            </div>

                            <!-- Dirección -->
                            <div class="col-12">
                                <label
                                    for="direccion"
                                    class="form-label fw-semibold"
                                >
                                    <i class="bi bi-geo-alt me-1"></i>
                                    Dirección
                                </label>
                                <textarea
                                    class="form-control"
                                    id="direccion"
                                    rows="3"
                                    bind:value={formData.direccion}
                                    placeholder="Dirección completa del proveedor..."
                                ></textarea>
                            </div>

                            <!-- Estado -->
                            <div class="col-12">
                                <div class="card bg-light">
                                    <div class="card-body py-3">
                                        <div class="form-check form-switch">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="activo"
                                                bind:checked={formData.activo}
                                            />
                                            <label
                                                class="form-check-label fw-semibold"
                                                for="activo"
                                            >
                                                <i
                                                    class="bi bi-{formData.activo
                                                        ? 'check-circle-fill text-success'
                                                        : 'x-circle-fill text-secondary'} me-1"
                                                ></i>
                                                Proveedor {formData.activo
                                                    ? "activo"
                                                    : "inactivo"}
                                            </label>
                                            <div class="form-text">
                                                {formData.activo
                                                    ? "Este proveedor aparecerá en las listas activas"
                                                    : "Este proveedor estará inactivo y no aparecerá en las búsquedas"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-light">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            on:click={closeModal}
                        >
                            <i class="bi bi-x-lg me-1"></i> Cancelar
                        </button>
                        <button
                            type="submit"
                            class="btn btn-success"
                            disabled={formSubmitting}
                        >
                            {#if formSubmitting}
                                <span
                                    class="spinner-border spinner-border-sm me-1"
                                ></span>
                                Guardando...
                            {:else}
                                <i class="bi bi-save me-1"></i>
                                {editingProveedor
                                    ? "Actualizar Proveedor"
                                    : "Guardar Proveedor"}
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
    .avatar-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
    }

    .card {
        border: none;
        border-radius: 12px;
    }

    .table th {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.875rem;
        letter-spacing: 0.5px;
    }

    .btn-group-sm > .btn {
        padding: 0.25rem 0.5rem;
    }

    .modal.show {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        border: none;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
        border-bottom: none;
        padding: 1.5rem;
    }

    .modal-header.bg-gradient-success {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-footer {
        border-top: 1px solid #dee2e6;
        padding: 1rem 1.5rem;
    }

    .form-label {
        margin-bottom: 0.5rem;
        color: #495057;
    }

    .form-label i {
        opacity: 0.7;
    }

    .form-control {
        border-radius: 8px;
        border: 1px solid #ced4da;
        padding: 0.625rem 0.875rem;
        transition: all 0.2s ease;
    }

    .form-control:focus {
        border-color: #4facfe;
        box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
    }

    .form-check-input {
        width: 3rem;
        height: 1.5rem;
        cursor: pointer;
    }

    .form-check-input:checked {
        background-color: #28a745;
        border-color: #28a745;
    }

    .input-group-text {
        background-color: #f8f9fa;
        border-radius: 8px 0 0 8px;
    }

    .btn {
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .btn:hover {
        transform: translateY(-1px);
    }

    .alert-info {
        background-color: #e7f3ff;
        border-color: #b3d9ff;
        color: #004085;
        border-radius: 8px;
    }
</style>
