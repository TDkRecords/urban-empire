<script>
    export let tagsFiltradas = [];
    export let onEdit = () => {};
    export let onDelete = () => {};
</script>

{#if tagsFiltradas.length === 0}
    <div class="text-center py-5">
        <i class="fas fa-tags fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No hay etiquetas</h5>
        <p class="text-muted mb-0">
            Crea tu primera etiqueta para empezar a clasificar tus productos
        </p>
    </div>
{:else}
    <div class="table-responsive">
        <table class="table table-hover mb-0">
            <thead class="table-light">
                <tr>
                    <th class="border-0 fw-semibold text-muted">
                        <i class="fas fa-tag me-1"></i>
                        Nombre
                    </th>
                    <th class="border-0 fw-semibold text-muted">
                        <i class="fas fa-align-left me-1"></i>
                        Descripción
                    </th>
                    <th class="border-0 fw-semibold text-muted">
                        <i class="fas fa-palette me-1"></i>
                        Color
                    </th>
                    <th class="border-0 fw-semibold text-muted">
                        <i class="fas fa-calendar me-1"></i>
                        Creado
                    </th>
                    <th class="border-0 fw-semibold text-muted text-end">
                        <i class="fas fa-cogs me-1"></i>
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each tagsFiltradas as tag (tag.id)}
                    <tr class="align-middle">
                        <td>
                            <div class="d-flex align-items-center">
                                <span
                                    class="badge me-2"
                                    style="background-color: {tag.color || '#007bff'}; color: white;"
                                >
                                    {tag.nombre}
                                </span>
                            </div>
                        </td>
                        <td>
                            <span class="text-muted">
                                {tag.descripcion || 'Sin descripción'}
                            </span>
                        </td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div
                                    class="color-circle me-2"
                                    style="background-color: {tag.color || '#007bff'};"
                                ></div>
                                <code class="text-muted small">
                                    {tag.color || '#007bff'}
                                </code>
                            </div>
                        </td>
                        <td>
                            <small class="text-muted">
                                {#if tag.fechaCreacion}
                                    {new Date(tag.fechaCreacion.seconds * 1000).toLocaleDateString('es-ES')}
                                {:else}
                                    N/A
                                {/if}
                            </small>
                        </td>
                        <td class="text-end">
                            <div class="btn-group" role="group">
                                <button
                                    class="btn btn-sm btn-outline-primary"
                                    on:click={() => onEdit(tag)}
                                    title="Editar etiqueta"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    on:click={() => onDelete(tag)}
                                    title="Eliminar etiqueta"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<style>
    .table {
        margin-bottom: 0;
    }

    .table th {
        padding: 1rem 0.75rem;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e9ecef;
    }

    .table td {
        padding: 1rem 0.75rem;
        vertical-align: middle;
    }

    .badge {
        font-size: 0.75rem;
        padding: 0.375rem 0.75rem;
        border-radius: 20px;
        font-weight: 500;
    }

    .color-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #e9ecef;
    }

    .btn-group .btn {
        border-radius: 6px !important;
        margin: 0 1px;
        transition: all 0.2s ease;
    }

    .btn-group .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .btn-outline-primary:hover {
        background-color: #007bff;
        border-color: #007bff;
    }

    .btn-outline-danger:hover {
        background-color: #dc3545;
        border-color: #dc3545;
    }

    @media (max-width: 768px) {
        .table-responsive {
            font-size: 0.875rem;
        }

        .table th,
        .table td {
            padding: 0.5rem;
        }

        .badge {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
        }

        .btn-group {
            flex-direction: column;
            gap: 2px;
        }

        .btn-group .btn {
            margin: 0;
        }
    }
</style>