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
    import { fade, fly } from "svelte/transition";
    import {
        success as notifySuccess,
        error as notifyError,
        confirm as notifyConfirm,
    } from "$lib/utils/notify";

    // Componentes
    import SupplierSearch from "./modules/SupplierSearch.svelte";
    import SupplierTable from "./modules/SupplierTable.svelte";
    import SupplierFormModal from "./modules/SupplierFormModal.svelte";

    // Estado
    let proveedores = [];
    let deletedSuppliers = [];
    let loading = true;
    let error = null;
    let searchTerm = "";
    let unsubscribe = null;
    let unsubscribeDeleted = null;
    let unsubscribeAuth = null;

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

    // Cargar proveedores con onSnapshot (tiempo real)
    function loadSuppliers() {
        if (!browser) return;

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
                },
                (err) => {
                    console.error("Error al cargar proveedores:", err);
                    error = "Error al cargar los proveedores";
                    loading = false;
                },
            );

            // Cargar proveedores eliminados
            const qDeleted = query(
                collection(db, "proveedores_eliminados"),
                orderBy("deletedAt", "desc"),
            );

            unsubscribeDeleted = onSnapshot(
                qDeleted,
                (snapshot) => {
                    deletedSuppliers = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                },
                (err) => {
                    console.error(
                        "Error al cargar proveedores eliminados:",
                        err,
                    );
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
            error("El nombre del proveedor es obligatorio");
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
                notifySuccess("Proveedor actualizado exitosamente");
            } else {
                // Crear nuevo proveedor
                providerData.fechaCreacion = serverTimestamp();
                await addDoc(collection(db, "proveedores"), providerData);
                success("Proveedor creado exitosamente");
            }

            closeModal();
        } catch (err) {
            console.error("Error al guardar proveedor:", err);
            error = "Error al guardar el proveedor";
            error("Error al guardar el proveedor. Intente nuevamente.");
        } finally {
            formSubmitting = false;
        }
    }

    // Eliminar proveedor (mover a sección de eliminados)
    async function handleDelete(proveedor) {
        notifyConfirm(
            `¿Está seguro de eliminar el proveedor "${proveedor.nombre}"?`,
            async () => {
                try {
                    const { id, ...supplierData } = proveedor;
                    await setDoc(
                        doc(db, "proveedores_eliminados", proveedor.id),
                        {
                            ...supplierData,
                            deletedAt: serverTimestamp(),
                        },
                    );
                    await deleteDoc(doc(db, "proveedores", proveedor.id));
                    notifySuccess("Proveedor movido a eliminados");
                } catch (err) {
                    console.error("Error al eliminar proveedor:", err);
                    notifyError("Error al eliminar el proveedor");
                }
            },
            () => {
                // Cancelado por el usuario
            },
        );
    }

    // Restaurar proveedor eliminado
    async function handleRestore(proveedor) {
        notifyConfirm(
            `¿Deseas restaurar el proveedor "${proveedor.nombre}"?`,
            async () => {
                try {
                    const { id, deletedAt, ...supplierData } = proveedor;
                    await setDoc(doc(db, "proveedores", proveedor.id), {
                        ...supplierData,
                        fechaActualizacion: serverTimestamp(),
                    });
                    await deleteDoc(
                        doc(db, "proveedores_eliminados", proveedor.id),
                    );
                    notifySuccess("Proveedor restaurado correctamente");
                } catch (err) {
                    console.error("Error al restaurar proveedor:", err);
                    notifyError("Error al restaurar el proveedor");
                }
            },
            () => {
                // Cancelado por el usuario
            },
        );
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
            notifyError("Error al cambiar el estado del proveedor");
        }
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
        if (unsubscribeDeleted) {
            unsubscribeDeleted();
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
            class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3"
        >
            <div>
                <h1 class="h3 mb-0">
                    <i class="bi bi-people-fill me-2 text-primary"></i>
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
            <div class="d-flex flex-wrap gap-2">
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
                    <i class="bi bi-plus-lg me-1"></i>
                    <span class="d-none d-sm-inline">Nuevo Proveedor</span>
                    <span class="d-inline d-sm-none">Nuevo</span>
                </button>
            </div>
        </div>

        <!-- Buscador -->
        <SupplierSearch
            bind:searchTerm
            placeholder="Buscar por nombre, email, teléfono o contacto..."
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
            <SupplierTable
                proveedores={proveedoresFiltrados}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onToggleStatus={toggleStatus}
            />

            <div class="mt-3 text-muted small text-center text-lg-start">
                Mostrando {proveedoresFiltrados.length} de {proveedores.length} proveedores
            </div>
        {/if}

        <!-- Proveedores eliminados -->
        {#if deletedSuppliers.length > 0}
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-light border-bottom py-3">
                            <h5 class="mb-0 fw-semibold">
                                <i class="bi bi-trash-fill text-danger me-2"
                                ></i>
                                Proveedores eliminados ({deletedSuppliers.length})
                            </h5>
                        </div>
                        <div class="card-body p-0">
                            <div class="list-group list-group-flush">
                                {#each deletedSuppliers as supplier, i}
                                    <div
                                        class="list-group-item list-group-item-action"
                                        in:fly={{
                                            x: -20,
                                            duration: 300,
                                            delay: i * 50,
                                        }}
                                    >
                                        <div
                                            class="d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <h6 class="mb-1 fw-semibold">
                                                    {supplier.nombre}
                                                </h6>
                                                <div
                                                    class="d-flex gap-3 align-items-center"
                                                >
                                                    {#if supplier.email}
                                                        <small
                                                            class="text-muted"
                                                        >
                                                            <i
                                                                class="bi bi-envelope me-1"
                                                            ></i>
                                                            {supplier.email}
                                                        </small>
                                                    {/if}
                                                    {#if supplier.telefono}
                                                        <small
                                                            class="text-muted"
                                                        >
                                                            <i
                                                                class="bi bi-telephone me-1"
                                                            ></i>
                                                            {supplier.telefono}
                                                        </small>
                                                    {/if}
                                                </div>
                                            </div>
                                            <button
                                                class="btn btn-sm btn-outline-success"
                                                on:click={() =>
                                                    handleRestore(supplier)}
                                            >
                                                <i
                                                    class="bi bi-arrow-counterclockwise me-1"
                                                ></i>
                                                Restaurar
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<!-- Modal -->
<SupplierFormModal
    bind:showModal
    bind:editingProveedor
    bind:formData
    bind:formSubmitting
    onClose={closeModal}
    onSubmit={handleSubmit}
/>
