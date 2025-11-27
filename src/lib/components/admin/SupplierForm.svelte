<script>
    export let supplier = {
        nombre: "",
        direccion: "",
        telefono: "",
        email: "",
        contacto: "",
    };

    export let isEditing = false;
    export let onSave;
    export let onClose;

    // Initialize form with supplier values
    let form = { ...supplier };

    function handleSubmit() {
        onSave({
            ...supplier,
            ...form,
        });
    }
</script>

<div class="offcanvas-header">
    <h5 class="offcanvas-title" id="supplierOffcanvasLabel">
        {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
    </h5>
    <button
        type="button"
        class="btn-close"
        on:click={onClose}
        aria-label="Cerrar"
    ></button>
</div>

<div class="offcanvas-body">
    <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre del Proveedor</label>
            <input
                type="text"
                class="form-control"
                id="nombre"
                bind:value={form.nombre}
                required
            />
        </div>

        <div class="mb-3">
            <label for="direccion" class="form-label">Dirección</label>
            <input
                type="text"
                class="form-control"
                id="direccion"
                bind:value={form.direccion}
            />
        </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input
                    type="tel"
                    class="form-control"
                    id="telefono"
                    bind:value={form.telefono}
                />
            </div>

            <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    type="email"
                    class="form-control"
                    id="email"
                    bind:value={form.email}
                />
            </div>
        </div>

        <div class="mb-3">
            <label for="contacto" class="form-label">Persona de Contacto</label>
            <input
                type="text"
                class="form-control"
                id="contacto"
                bind:value={form.contacto}
            />
        </div>

        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
                type="button"
                class="btn btn-outline-secondary me-md-2"
                on:click={onClose}
            >
                Cancelar
            </button>
            <button type="submit" class="btn btn-custom-primary">
                {isEditing ? "Guardar cambios" : "Crear proveedor"}
            </button>
        </div>
    </form>
</div>
