<script>
    import { fade } from "svelte/transition";

    export let proveedores = [];
    export let loading = false;
    export let openCreateSupplierModal;
    export let openEditSupplierModal;
    export let handleDeleteSupplier;

    let search = "";

    // Filtrar proveedores según búsqueda
    $: proveedoresFiltrados = proveedores.filter((p) => {
        const text = search.toLowerCase();
        return (
            p.nombre?.toLowerCase().includes(text) ||
            p.empresa?.toLowerCase().includes(text) ||
            p.contacto?.toLowerCase().includes(text)
        );
    });

    function getStatusColor(estado) {
        return estado === "Activo" ? "success" : "secondary";
    }
</script>

<div class="suppliers-container">
    <!-- HEADER -->
    <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
    >
        <div>
            <h2 class="h4 mb-0">Proveedores</h2>
            <p class="text-muted mb-0">
                {proveedores.length}
                {proveedores.length === 1 ? " proveedor" : " proveedores"} registrados
            </p>
        </div>

        <div class="d-flex gap-2">
            <!-- Buscador -->
            <div class="input-group" style="max-width: 320px;">
                <span class="input-group-text bg-white border-end-0">
                    <i class="fa-solid fa-magnifying-glass text-muted"></i>
                </span>
                <input
                    type="text"
                    class="form-control border-start-0"
                    placeholder="Buscar proveedores..."
                    bind:value={search}
                />
            </div>

            <!-- Botón agregar -->
            <button
                class="btn btn-primary d-flex align-items-center gap-2"
                on:click={openCreateSupplierModal}
            >
                <i class="fa-solid fa-plus"></i>
                <span class="d-none d-sm-inline">Nuevo Proveedor</span>
            </button>
        </div>
    </div>

    <!-- LOADING -->
    {#if loading}
        <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Cargando proveedores...</p>
        </div>

        <!-- SIN PROVEEDORES -->
    {:else if proveedores.length === 0}
        <div class="text-center py-5 bg-white rounded-3 shadow-sm">
            <div class="mb-3">
                <i class="fa-solid fa-truck text-muted" style="font-size: 3rem;"
                ></i>
            </div>
            <h3 class="h5">No hay proveedores registrados</h3>
            <p class="text-muted mb-4">Agrega tu primer proveedor</p>

            <button class="btn btn-primary" on:click={openCreateSupplierModal}>
                <i class="fa-solid fa-plus me-2"></i>Agregar Proveedor
            </button>
        </div>

        <!-- NO COINCIDENCIAS -->
    {:else if proveedoresFiltrados.length === 0}
        <div class="text-center py-5 bg-white rounded-3 shadow-sm">
            <div class="mb-3">
                <i
                    class="fa-solid fa-circle-xmark text-danger"
                    style="font-size: 3rem;"
                ></i>
            </div>
            <h3 class="h5">No se encontraron resultados</h3>
            <p class="text-muted">Prueba buscando otro término</p>
        </div>

        <!-- TABLA -->
    {:else}
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th class="ps-3">Proveedor</th>
                        <th>Contacto</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th class="text-end pe-3">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {#each proveedoresFiltrados as proveedor (proveedor.id)}
                        <tr in:fade>
                            <td class="ps-3">
                                <div class="d-flex align-items-center gap-2">
                                    <div
                                        class="rounded-circle bg-light d-flex justify-content-center align-items-center"
                                        style="width: 40px; height: 40px;"
                                    >
                                        <i
                                            class="fa-solid fa-building text-primary"
                                        ></i>
                                    </div>

                                    <div>
                                        <div class="fw-semibold">
                                            {proveedor.nombre}
                                        </div>
                                        <small class="text-muted"
                                            >{proveedor.empresa ||
                                                "Sin empresa"}</small
                                        >
                                    </div>
                                </div>
                            </td>

                            <td>{proveedor.contacto || "No especificado"}</td>
                            <td>{proveedor.telefono || "No especificado"}</td>
                            <td>{proveedor.email || "No especificado"}</td>

                            <td>
                                <span
                                    class="badge bg-{getStatusColor(
                                        proveedor.estado || 'Inactivo',
                                    )}"
                                >
                                    {proveedor.estado || "Inactivo"}
                                </span>
                            </td>

                            <td class="text-end pe-3">
                                <div class="btn-group btn-group-sm">
                                    <button
                                        class="btn btn-outline-primary"
                                        on:click={() =>
                                            openEditSupplierModal(proveedor)}
                                        title="Editar"
                                        aria-label="Editar proveedor"
                                    >
                                        <i class="fa-solid fa-pen"></i>
                                    </button>

                                    <button
                                        class="btn btn-outline-danger"
                                        on:click={() =>
                                            handleDeleteSupplier(proveedor)}
                                        title="Eliminar"
                                        aria-label="Eliminar proveedor"
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
