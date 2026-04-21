<script>
    import { fly } from "svelte/transition";

    export let showModal = false;
    export let editingProducto = null;
    export let formData = {};
    export let formSubmitting = false;
    export let tags = [];
    export let onClose = () => {};
    export let onSubmit = () => {};
</script>

{#if showModal}
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div
            class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        >
            <div class="modal-content" in:fly={{ y: -50, duration: 300 }}>
                <div class="modal-header purple-500 text-white">
                    <h5 class="modal-title">
                        <i
                            class="fas fa-{editingProducto
                                ? 'pen'
                                : 'plus-circle'} me-2"
                        ></i>
                        {editingProducto ? "Editar Producto" : "Nuevo Producto"}
                    </h5>
                    <button
                        aria-label="Cerrar"
                        type="button"
                        class="btn-close btn-close-white"
                        on:click={onClose}
                    ></button>
                </div>
                <form on:submit|preventDefault={onSubmit}>
                    <div class="modal-body">
                        <div class="row g-3">
                            <!-- Nombre -->
                            <div class="col-12">
                                <label
                                    for="nombre"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-box me-1"></i>
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
                                    <i class="fas fa-align-left me-1"></i>
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

                            <!-- Etiquetas -->
                            <div class="col-12 col-md-6">
                                <label
                                    for="etiquetas"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-tags me-1"></i>
                                    Etiqueta
                                </label>
                                <select
                                    class="form-select"
                                    id="etiquetas"
                                    bind:value={formData.etiquetas}
                                >
                                    <option value="">Sin etiqueta</option>
                                    {#each tags as tag}
                                        <option value={tag.id}>{tag.nombre}</option>
                                    {/each}
                                </select>
                            </div>

                            <!-- Stock -->
                            <div class="col-12 col-md-6">
                                <label
                                    for="stock"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-cubes me-1"></i>
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
                            <div class="col-12 col-md-6">
                                <label
                                    for="costoProd"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-money-bill me-1"></i>
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
                            <div class="col-12 col-md-6">
                                <label
                                    for="precio"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-coins me-1"></i>
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
                                    <i class="fas fa-image me-1"></i>
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
                    <div class="modal-footer bg-light">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            on:click={onClose}
                        >
                            <i class="fas fa-times me-1"></i> Cancelar
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
                                <i class="fas fa-save me-1"></i>
                                {editingProducto ? "Actualizar" : "Guardar"}
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <button
        class="modal-backdrop fade show"
        aria-label="button"
        on:click={onClose}
    ></button>
{/if}

<style>
    .modal.show {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        border: none;
        border-radius: 12px;
        overflow: scroll;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
        border-bottom: none;
        padding: 1.5rem;
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
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    textarea.form-control {
        resize: vertical;
        font-family: inherit;
    }

    @media (max-width: 576px) {
        .modal-dialog {
            margin: 0.5rem;
        }

        .modal-header {
            padding: 1rem;
        }

        .modal-body {
            padding: 1rem;
        }

        .row.g-3 {
            gap: 0.75rem !important;
        }
    }
</style>
