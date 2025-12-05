<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { getCurrentUser, isAuthenticated } from "$lib/utils/auth";
    import {
        collection,
        getDocs,
        addDoc,
        query,
        orderBy,
        limit,
        startAfter,
        where,
        serverTimestamp,
    } from "firebase/firestore";
    import { db } from "$lib/assets/js/firebase";

    // Estado
    let proveedores = [];
    let loading = true;
    let error = null;
    const itemsPerPage = 10;
    let currentPage = 1;
    let lastVisible = null;
    let hasNextPage = false;
    let totalProveedores = 0;
    let unsubscribe = null; // Para manejar la suscripción

    // Estado del modal y formulario
    let showNewProviderModal = false;
    let formSubmitting = false;
    let newProvider = {
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        activo: true,
        fechaCreacion: null,
    };

    // Función para manejar el envío del formulario
    async function handleSubmit() {
        if (!newProvider.nombre.trim()) {
            error = "El nombre del proveedor es obligatorio";
            return;
        }

        formSubmitting = true;
        error = null;

        try {
            // Agregar la fecha de creación
            const providerData = {
                ...newProvider,
                fechaCreacion: serverTimestamp(),
                fechaActualizacion: serverTimestamp(),
            };

            // Guardar en Firestore
            const docRef = await addDoc(
                collection(db, "proveedores"),
                providerData,
            );

            // Cerrar el modal y resetear el formulario
            showNewProviderModal = false;
            newProvider = {
                nombre: "",
                email: "",
                telefono: "",
                direccion: "",
                activo: true,
                fechaCreacion: null,
            };

            // Recargar la lista de proveedores
            await loadSuppliers(currentPage);
        } catch (err) {
            console.error("Error al guardar el proveedor:", err);
            error =
                "Error al guardar el proveedor. Por favor, intente nuevamente.";
        } finally {
            formSubmitting = false;
        }
    }

    // Verificar autenticación
    function checkAuth() {
        if (!browser) return false;

        if (!isAuthenticated()) {
            window.location.href = "/admin-panel-2025/login";
            return false;
        }
        return true;
    }

    // Cargar proveedores
    async function loadSuppliers(page = 1) {
        console.log("Cargando proveedores, página:", page);
        if (!browser) {
            console.log("No estamos en el navegador");
            return;
        }

        // Verificar autenticación
        if (!isAuthenticated()) {
            console.log("Usuario no autenticado, redirigiendo...");
            window.location.href = "/admin-panel-2025/login";
            return;
        }

        // Cancelar suscripción anterior si existe
        if (unsubscribe) {
            unsubscribe();
        }

        try {
            loading = true;
            error = null;
            console.log("Iniciando carga de proveedores...");

            const suppliersRef = collection(db, "proveedores");
            console.log("Referencia a la colección creada");

            // Consulta para la paginación
            let q = query(
                suppliersRef,
                orderBy("nombre"),
                limit(itemsPerPage + 1),
            );

            // Si no es la primera página, usar startAfter para paginación
            if (page > 1) {
                // Si no tenemos lastVisible, necesitamos cargar la página anterior
                if (!lastVisible) {
                    const prevPageQuery = query(
                        suppliersRef,
                        orderBy("nombre"),
                        limit((page - 1) * itemsPerPage),
                    );
                    const prevSnapshot = await getDocs(prevPageQuery);
                    const prevDocs = prevSnapshot.docs;
                    lastVisible = prevDocs[prevDocs.length - 1];
                }

                if (lastVisible) {
                    console.log(
                        "Cargando página",
                        page,
                        "con lastVisible:",
                        lastVisible.id,
                    );
                    q = query(
                        suppliersRef,
                        orderBy("nombre"),
                        startAfter(lastVisible),
                        limit(itemsPerPage + 1),
                    );
                }
            }

            // Obtener total de proveedores
            const countQuery = query(suppliersRef);
            const countSnapshot = await getDocs(countQuery);
            totalProveedores = countSnapshot.size;
            console.log("Total de proveedores:", totalProveedores);

            const snapshot = await getDocs(q);
            console.log("Documentos obtenidos:", snapshot.docs.length);

            // Verificar si hay documentos
            if (snapshot.empty) {
                console.log("No se encontraron documentos");
                proveedores = [];
                hasNextPage = false;
                return;
            }

            const docs = snapshot.docs;
            hasNextPage = docs.length > itemsPerPage;
            console.log("¿Hay más páginas?", hasNextPage);

            // Si hay más documentos de los que mostramos, quitamos el último
            const docsToShow = hasNextPage ? docs.slice(0, -1) : docs;
            console.log("Documentos a mostrar:", docsToShow.length);

            // Actualizar lastVisible para la próxima página
            if (docsToShow.length > 0) {
                lastVisible = docsToShow[docsToShow.length - 1];
                console.log("Nuevo lastVisible:", lastVisible.id);
            }

            // Mapear documentos
            const proveedoresCargados = docsToShow.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    nombre: data.nombre?.trim() || "Sin nombre",
                    email: data.email?.trim() || "No especificado",
                    telefono: data.telefono?.trim() || "No especificado",
                    direccion: data.direccion?.trim() || "No especificada",
                    activo: data.activo !== undefined ? data.activo : true,
                    fechaCreacion:
                        data.fechaCreacion?.toDate?.() || data.fechaCreacion,
                    fechaActualizacion:
                        data.fechaActualizacion?.toDate?.() ||
                        data.fechaActualizacion,
                };
            });

            proveedores = proveedoresCargados;
            console.log("Proveedores actualizados:", proveedores);

            // Actualizar la URL usando la API de SvelteKit
            const url = new URL(window.location);
            if (page > 1) {
                url.searchParams.set("page", page);
            } else {
                url.searchParams.delete("page");
            }
            // Usar goto de SvelteKit en lugar de pushState directamente
            goto(url.toString(), {
                replaceState: true,
                keepFocus: true,
                noScroll: true,
            });
        } catch (err) {
            console.error("Error al cargar proveedores:", err);
            error =
                "Error al cargar los proveedores. Por favor, intente de nuevo más tarde.";
            proveedores = [];
        } finally {
            loading = false;
        }
    }

    // Navegación de páginas
    function goToPage(page) {
        if (page < 1 || page === currentPage) return;
        currentPage = page;
        loadSuppliers(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Inicializar
    onMount(async () => {
        if (!browser) return;

        // Verificar autenticación
        if (!checkAuth()) {
            window.location.href = "/admin-panel-2025/login";
            return;
        }

        // Cargar la página actual de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get("page") || "1");
        currentPage = page;

        // Cargar proveedores
        await loadSuppliers(page);

        // Manejar el evento de popstate para navegación con el botón atrás/adelante
        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const newPage = parseInt(urlParams.get("page") || "1");
            if (newPage !== currentPage) {
                currentPage = newPage;
                loadSuppliers(newPage);
            }
        };

        window.addEventListener("popstate", handlePopState);

        // Limpiar el event listener al desmontar el componente
        return () => {
            window.removeEventListener("popstate", handlePopState);
            if (unsubscribe) {
                unsubscribe();
            }
        };
    });

    // Función para formatear fecha
    function formatDate(dateString) {
        if (!dateString) return "No especificada";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (e) {
            return dateString;
        }
    }
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
        <!-- Header con botones de navegación -->
        <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        >
            <div>
                <a
                    href="/admin-panel-2025"
                    class="btn btn-outline-secondary btn-sm mb-2 mb-md-0"
                >
                    <i class="bi bi-arrow-left me-1"></i> Volver al Dashboard
                </a>
                <h1 class="h3 mb-0 mt-2">Gestión de Proveedores</h1>
                {#if !loading}
                    <p class="text-muted mb-0 mt-1">
                        Mostrando {proveedores.length} de {totalProveedores} proveedores
                    </p>
                {/if}
            </div>
            <div class="d-flex gap-2">
                <button
                    class="btn btn-outline-secondary"
                    on:click={() => loadSuppliers(currentPage)}
                    disabled={loading}
                >
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button
                    class="btn btn-primary"
                    on:click={() => (showNewProviderModal = true)}
                >
                    <i class="bi bi-plus-lg me-1"></i> Nuevo Proveedor
                </button>
            </div>
        </div>

        <!-- Mensaje de error -->
        {#if error}
            <div
                class="alert alert-danger d-flex align-items-center"
                role="alert"
            >
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
            </div>
        {/if}

        <!-- Estado de carga -->
        {#if loading}
            <div class="text-center my-5 py-5">
                <div
                    class="spinner-border text-primary"
                    role="status"
                    style="width: 3rem; height: 3rem;"
                >
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">Cargando proveedores...</p>
                <div
                    class="progress mt-3"
                    style="height: 4px; max-width: 200px; margin: 0 auto;"
                >
                    <div
                        class="progress-bar progress-bar-striped progress-bar-animated w-100"
                    ></div>
                </div>
            </div>

            <!-- Tabla de proveedores -->
            {#if proveedores.length > 0}
                <div class="card shadow-sm mb-4">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th>Estado</th>
                                    <th class="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each proveedores as proveedor}
                                    <tr>
                                        <td class="align-middle">
                                            <div
                                                class="d-flex align-items-center"
                                            >
                                                <div>
                                                    <div class="fw-semibold">
                                                        {proveedor.nombre}
                                                    </div>
                                                    <div
                                                        class="text-muted small"
                                                    >
                                                        ID: {proveedor.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="align-middle">
                                            <a
                                                href="mailto:{proveedor.email}"
                                                class="text-decoration-none"
                                            >
                                                {proveedor.email}
                                            </a>
                                        </td>
                                        <td class="align-middle"
                                            >{proveedor.telefono}</td
                                        >
                                        <td class="align-middle"
                                            >{proveedor.direccion}</td
                                        >
                                        <td class="align-middle">
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
                                        <td class="text-end align-middle">
                                            <div class="btn-group btn-group-sm">
                                                <a
                                                    href="/admin-panel-2025/proveedores/editar/{proveedor.id}"
                                                    class="btn btn-outline-primary"
                                                >
                                                    <i class="bi bi-pencil"></i>
                                                </a>
                                                <button
                                                    class="btn btn-outline-danger"
                                                    on:click|preventDefault={() =>
                                                        toggleStatus(proveedor)}
                                                    title={proveedor.activo
                                                        ? "Desactivar"
                                                        : "Activar"}
                                                >
                                                    <i
                                                        class="bi bi-{proveedor.activo
                                                            ? 'x-circle'
                                                            : 'check-circle'}"
                                                    ></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {:else}
                <div class="text-center my-5 py-5 bg-white rounded-3 shadow-sm">
                    <div class="py-4">
                        <i
                            class="bi bi-people text-muted"
                            style="font-size: 4rem; opacity: 0.5;"
                        ></i>
                        <h3 class="h4 mt-4">No hay proveedores registrados</h3>
                        <p class="text-muted mb-4">
                            Comienza agregando tu primer proveedor
                        </p>
                        <a
                            href="/admin-panel-2025/proveedores/nuevo"
                            class="btn btn-primary"
                        >
                            <i class="bi bi-plus-lg me-1"></i> Agregar Proveedor
                        </a>
                    </div>
                </div>
            {/if}

            <!-- Paginación -->
            {#if proveedores.length > 0}
                <div
                    class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4"
                >
                    <div class="text-muted small mb-3 mb-md-0">
                        Mostrando {itemsPerPage * (currentPage - 1) + 1} a {Math.min(
                            itemsPerPage * currentPage,
                            totalProveedores,
                        )} de {totalProveedores} proveedores
                    </div>
                    <nav aria-label="Navegación de proveedores">
                        <ul class="pagination mb-0">
                            <li
                                class="page-item {currentPage === 1
                                    ? 'disabled'
                                    : ''}"
                            >
                                <a
                                    class="page-link"
                                    href="#"
                                    on:click|preventDefault={() =>
                                        goToPage(currentPage - 1)}
                                    aria-label="Anterior"
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>

                            {#if currentPage > 3}
                                <li class="page-item">
                                    <a
                                        class="page-link"
                                        href="#"
                                        on:click|preventDefault={() =>
                                            goToPage(1)}>1</a
                                    >
                                </li>
                                {#if currentPage > 4}
                                    <li class="page-item disabled">
                                        <span class="page-link">...</span>
                                    </li>
                                {/if}
                            {/if}

                            {#each Array(Math.min(3, Math.ceil(totalProveedores / itemsPerPage))) as _, i}
                                {#if (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1) || (currentPage === 1 && i < 3) || (currentPage === Math.ceil(totalProveedores / itemsPerPage) && i >= Math.ceil(totalProveedores / itemsPerPage) - 3)}
                                    <li
                                        class="page-item {i + 1 === currentPage
                                            ? 'active'
                                            : ''}"
                                    >
                                        <a
                                            class="page-link"
                                            href="#"
                                            on:click|preventDefault={() =>
                                                goToPage(i + 1)}
                                        >
                                            {i + 1}
                                        </a>
                                    </li>
                                {/if}
                            {/each}

                            {#if currentPage < Math.ceil(totalProveedores / itemsPerPage) - 2}
                                {#if currentPage < Math.ceil(totalProveedores / itemsPerPage) - 3}
                                    <li class="page-item disabled">
                                        <span class="page-link">...</span>
                                    </li>
                                {/if}
                                <li class="page-item">
                                    <a
                                        class="page-link"
                                        href="#"
                                        on:click|preventDefault={() =>
                                            goToPage(
                                                Math.ceil(
                                                    totalProveedores /
                                                        itemsPerPage,
                                                ),
                                            )}
                                    >
                                        {Math.ceil(
                                            totalProveedores / itemsPerPage,
                                        )}
                                    </a>
                                </li>
                            {/if}

                            <li
                                class="page-item {!hasNextPage
                                    ? 'disabled'
                                    : ''}"
                            >
                                <a
                                    class="page-link"
                                    href="#"
                                    on:click|preventDefault={() =>
                                        goToPage(currentPage + 1)}
                                    aria-label="Siguiente"
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            {/if}
        {/if}
    </div>
</div>

<!-- Modal Nuevo Proveedor -->
{#if showNewProviderModal}
    <div
        class="modal fade show"
        tabindex="-1"
        style="display: block;"
        role="dialog"
        aria-modal="true"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">Nuevo Proveedor</h5>
                    <button
                        type="button"
                        class="btn-close btn-close-white"
                        on:click|preventDefault={() =>
                            (showNewProviderModal = false)}
                    ></button>
                </div>
                <div class="modal-body">
                    <form on:submit|preventDefault={handleSubmit}>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="nombre" class="form-label"
                                    >Nombre del Proveedor *</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="nombre"
                                    bind:value={newProvider.nombre}
                                    required
                                />
                            </div>
                            <div class="col-md-6">
                                <label for="email" class="form-label"
                                    >Email</label
                                >
                                <input
                                    type="email"
                                    class="form-control"
                                    id="email"
                                    bind:value={newProvider.email}
                                />
                            </div>
                            <div class="col-md-6">
                                <label for="telefono" class="form-label"
                                    >Teléfono</label
                                >
                                <input
                                    type="tel"
                                    class="form-control"
                                    id="telefono"
                                    bind:value={newProvider.telefono}
                                />
                            </div>
                            <div class="col-12">
                                <label for="direccion" class="form-label"
                                    >Dirección</label
                                >
                                <textarea
                                    class="form-control"
                                    id="direccion"
                                    rows="2"
                                    bind:value={newProvider.direccion}
                                ></textarea>
                            </div>
                            <div class="col-12">
                                <div class="form-check form-switch">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        id="activo"
                                        bind:checked={newProvider.activo}
                                    />
                                    <label class="form-check-label" for="activo"
                                        >Proveedor activo</label
                                    >
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        on:click={() => (showNewProviderModal = false)}
                    >
                        <i class="bi bi-x-lg me-1"></i> Cancelar
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        on:click={handleSubmit}
                        disabled={formSubmitting}
                    >
                        {#if formSubmitting}
                            <span
                                class="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            Guardando...
                        {:else}
                            <i class="bi bi-save me-1"></i> Guardar
                        {/if}
                    </button>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    </div>
{/if}

<!-- Estilos eliminados temporalmente para depuración -->
