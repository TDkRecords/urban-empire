<script>
    import { fly } from "svelte/transition";

    export let proveedores = [];
    export let onEdit = () => {};
    export let onDelete = () => {};
    export let onToggleStatus = () => {};
</script>

<div class="card shadow-sm">
    <div class="table-responsive">
        <table class="table table-hover mb-0 align-middle">
            <thead class="table-light">
                <tr>
                    <th class="ps-3 d-none d-md-table-cell">Proveedor</th>
                    <th class="d-table-cell d-md-none ps-3">Info</th>
                    <th class="d-none d-lg-table-cell">Contacto</th>
                    <th class="d-none d-sm-table-cell">Email</th>
                    <th class="d-none d-md-table-cell">Teléfono</th>
                    <th>Estado</th>
                    <th class="text-end pe-3">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each proveedores as proveedor (proveedor.id)}
                    <tr in:fly={{ y: 20, duration: 300 }}>
                        <td class="ps-3">
                            <div class="d-flex align-items-center gap-2">
                                <div class="avatar-circle">
                                    <i class="bi bi-building"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <div class="fw-semibold">{proveedor.nombre}</div>
                                    {#if proveedor.direccion}
                                        <small class="text-muted d-block d-md-none">{proveedor.direccion}</small>
                                        <small class="text-muted d-none d-md-block">{proveedor.direccion}</small>
                                    {/if}
                                    {#if proveedor.contacto}
                                        <small class="text-muted d-block d-md-none">Contacto: {proveedor.contacto}</small>
                                    {/if}
                                </div>
                            </div>
                        </td>
                        <td class="d-none d-lg-table-cell">{proveedor.contacto || "No especificado"}</td>
                        <td class="d-none d-sm-table-cell">
                            {#if proveedor.email}
                                <a href="mailto:{proveedor.email}" class="text-decoration-none">
                                    {proveedor.email}
                                </a>
                            {:else}
                                <span class="text-muted">No especificado</span>
                            {/if}
                        </td>
                        <td class="d-none d-md-table-cell">
                            {#if proveedor.telefono}
                                <a href="tel:{proveedor.telefono}" class="text-decoration-none">
                                    {proveedor.telefono}
                                </a>
                            {:else}
                                <span class="text-muted">No especificado</span>
                            {/if}
                        </td>
                        <td>
                            <span class="badge bg-{proveedor.activo ? 'success' : 'secondary'}">
                                {proveedor.activo ? "Activo" : "Inactivo"}
                            </span>
                        </td>
                        <td class="text-end pe-3">
                            <div class="btn-group btn-group-sm flex-wrap">
                                <button
                                    aria-label="Editar"
                                    class="btn btn-outline-primary"
                                    on:click={() => onEdit(proveedor)}
                                    title="Editar"
                                >
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button
                                    aria-label="Activar/Desactivar"
                                    class="btn btn-outline-{proveedor.activo ? 'warning' : 'success'}"
                                    on:click={() => onToggleStatus(proveedor)}
                                    title={proveedor.activo ? "Desactivar" : "Activar"}
                                >
                                    <i class="bi bi-{proveedor.activo ? 'pause' : 'play'}-circle"></i>
                                </button>
                                <button
                                    aria-label="Eliminar"
                                    class="btn btn-outline-danger"
                                    on:click={() => onDelete(proveedor)}
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
        flex-shrink: 0;
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

    @media (max-width: 576px) {
        .btn-group-sm {
            flex-direction: column;
            width: 100%;
        }
        .btn-group-sm > .btn {
            margin-bottom: 0.25rem;
        }
    }
</style>