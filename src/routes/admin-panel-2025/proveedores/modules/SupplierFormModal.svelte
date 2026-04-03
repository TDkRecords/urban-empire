<script>
    import { fly } from "svelte/transition";

    export let showModal = false;
    export let editingProveedor = null;
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
                            class="fas fa-{editingProveedor
                                ? 'pen'
                                : 'plus-circle'} me-2"
                        ></i>
                        {editingProveedor
                            ? "Editar Proveedor"
                            : "Nuevo Proveedor"}
                    </h5>
                    <button
                        type="button"
                        class="btn-close btn-close-white"
                        on:click={onClose}
                        aria-label="Cerrar"
                    ></button>
                </div>
                <form on:submit|preventDefault={onSubmit}>
                    <div class="modal-body">
                        <div
                            class="alert alert-info d-flex align-items-center mb-4"
                        >
                            <i class="fas fa-info-circle me-2"></i>
                            <small
                                >Los campos marcados con * son obligatorios</small
                            >
                        </div>

                        <div class="row g-3">
                            <!-- Nombre -->
                            <div class="col-12">
                                <label
                                    for="nombre"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-building me-1"></i>
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
                            <div class="col-12 col-md-6">
                                <label
                                    for="contacto"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-user me-1"></i>
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
                            <div class="col-12 col-md-6">
                                <label
                                    for="email"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-envelope me-1"></i>
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
                            <div class="col-12 col-md-6">
                                <label
                                    for="telefono"
                                    class="form-label fw-semibold"
                                >
                                    <i class="fas fa-phone me-1"></i>
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
                                    <i class="fas fa-map-location-dot me-1"></i>
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
                                                    class="fas fa-{formData.activo
                                                        ? 'check-circle text-success'
                                                        : 'circle-xmark text-secondary'} me-1"
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
    <button
        aria-label="button"
        class="modal-backdrop fade show"
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
