<script>
    export let product = {
        nombre: "",
        descripcion: "",
        costoProd: 0,
        precio: 0,
        stock: 0,
        categoria: "",
        imagen: "",
    };

    export let isEditing = false;
    export let onSave;
    export let onClose;

    // Initialize form with product data
    $: form = {
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        costoProd: product.costoProd || 0,
        precio: product.precio || 0,
        stock: product.stock || 0,
        categoria: product.categoria || "",
        imagen: product.imagen || "",
    };

    function handleSubmit() {
        onSave({
            ...form,
            precio: Number(form.precio) || 0,
            stock: Number(form.stock) || 0,
        });
    }
</script>

<div class="offcanvas-header">
    <h5 class="offcanvas-title">
        {isEditing ? "Editar Producto" : "Nuevo Producto"}
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
            <label for="nombre" class="form-label">Nombre</label>
            <input
                type="text"
                class="form-control"
                id="nombre"
                bind:value={form.nombre}
                required
            />
        </div>

        <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción</label>
            <textarea
                class="form-control"
                id="descripcion"
                rows="3"
                bind:value={form.descripcion}
            ></textarea>
        </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="costoProd" class="form-label">Costo de Compra</label
                >
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                        type="number"
                        class="form-control"
                        id="costoProd"
                        step="0.01"
                        min="0"
                        bind:value={form.costoProd}
                        required
                    />
                </div>
            </div>

            <div class="col-md-6 mb-3">
                <label for="precio" class="form-label">Precio de Venta</label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                        type="number"
                        class="form-control"
                        id="precio"
                        step="0.01"
                        min={form.costoProd || 0}
                        bind:value={form.precio}
                        required
                    />
                </div>
            </div>

            <div class="col-md-6 mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input
                    type="number"
                    class="form-control"
                    id="stock"
                    min="0"
                    bind:value={form.stock}
                    required
                />
            </div>
        </div>

        <div class="mb-3">
            <label for="categoria" class="form-label">Categoría</label>
            <input
                type="text"
                class="form-control"
                id="categoria"
                bind:value={form.categoria}
            />
        </div>

        <div class="mb-3">
            <label for="imagen" class="form-label">URL de la imagen</label>
            <input
                type="url"
                class="form-control"
                id="imagen"
                bind:value={form.imagen}
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
            <button type="submit" class="btn btn-primary">
                {isEditing ? "Guardar cambios" : "Crear producto"}
            </button>
        </div>
    </form>
</div>
