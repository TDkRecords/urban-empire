<script>
    import { fly } from "svelte/transition";

    export let showModal = false;
    export let editingTag = null;
    export let formData = {};
    export let formSubmitting = false;
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
                            class="fas fa-{editingTag
                                ? 'pen'
                                : 'plus-circle'} me-2"
                        ></i>
                        {editingTag ? "Editar Etiqueta" : "Nueva Etiqueta"}
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
                                    <i class="fas fa-tag me-1"></i>
                                    Nombre de la Etiqueta *
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="nombre"
                                    bind:value={formData.nombre}
                                    placeholder="Ej: Pantalones, Camisas, Gorras"
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
                                    placeholder="Describe la etiqueta..."
                                ></textarea>
                            </div>

                            <!-- Color -->
                            <div class="col-12 col-md-6">
                                <label
                                    for="color"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-palette me-1"></i>
                                    Color
                                </label>
                                <div class="input-group">
                                    <input
                                        type="color"
                                        class="form-control form-control-color"
                                        id="color"
                                        bind:value={formData.color}
                                        style="width: 60px;"
                                    />
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={formData.color}
                                        placeholder="#007bff"
                                    />
                                </div>
                                {#if formData.color}
                                    <div class="mt-2">
                                        <small class="text-muted">Vista previa:</small>
                                        <span
                                            class="badge ms-2"
                                            style="background-color: {formData.color}; color: white;"
                                        >
                                            {formData.nombre || 'Etiqueta'}
                                        </span>
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
                                {editingTag ? "Actualizar" : "Guardar"}
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

    .form-control-color {
        border-radius: 8px 0 0 8px;
        border: 1px solid #ced4da;
        height: 38px;
    }

    textarea.form-control {
        resize: vertical;
        font-family: inherit;
    }

    .badge {
        font-size: 0.875rem;
        padding: 0.375rem 0.75rem;
        border-radius: 20px;
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

        .modal-footer {
            padding: 1rem;
        }
    }
</style>