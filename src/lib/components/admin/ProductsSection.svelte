<script>
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    export let productos = [];
    export let loading = false;
    export let openEditProductModal;
    export let handleDeleteProduct;

    let searchTerm = "";
    let selectedCategory = "all";
    let categories = [];
    let filteredProducts = [];

    // NUEVO → Para mostrar menú contextual
    let selectedProductId = null;
    function toggleMenu(id) {
        selectedProductId = selectedProductId === id ? null : id;
    }

    // Cerrar menú al hacer click fuera
    onMount(() => {
        const listener = (e) => {
            if (!e.target.closest(".producto-card")) {
                selectedProductId = null;
            }
        };
        document.addEventListener("click", listener);
        return () => document.removeEventListener("click", listener);
    });

    onMount(updateCategories);

    $: if (productos.length) {
        updateCategories();
        filteredProducts = filterProducts();
    }

    function updateCategories() {
        const unique = [
            ...new Set(productos.map((p) => p.categoria).filter(Boolean)),
        ];
        categories = ["Todas", ...unique.sort()];
    }

    function filterProducts() {
        return productos.filter((p) => {
            const matchesSearch =
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategory === "all" ||
                (selectedCategory === "Sin categoría" && !p.categoria) ||
                p.categoria === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }
</script>

<!-- ===========================
    🔍 FILTROS
=========================== -->
<div class="bg-white rounded-3 shadow-sm p-4 mb-4">
    <div class="row g-3 align-items-end">
        <div class="col-md-6">
            <label class="form-label text-muted fw-medium"
                >Buscar productos</label
            >
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-search text-muted"></i>
                </span>
                <input
                    id="searchProduct"
                    type="text"
                    class="form-control border-start-0"
                    placeholder="Nombre o descripción..."
                    bind:value={searchTerm}
                />
            </div>
        </div>

        <div class="col-md-4">
            <label class="form-label text-muted fw-medium">Categoría</label>
            <select class="form-select" bind:value={selectedCategory}>
                {#each categories as category}
                    <option value={category === "Todas" ? "all" : category}>
                        {category === "Todas"
                            ? "Todas las categorías"
                            : category}
                    </option>
                {/each}
            </select>
        </div>

        <div class="col-md-2">
            <button
                class="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                on:click={() => openEditProductModal()}
            >
                <i class="bi bi-plus-lg me-2"></i> Nuevo
            </button>
        </div>
    </div>
</div>

{#if loading}
    <div class="bg-white rounded-3 shadow-sm p-5 text-center">
        <div
            class="spinner-border text-primary mb-3"
            style="width:3rem;height:3rem;"
        ></div>
        <h5 class="text-muted">Cargando productos...</h5>
    </div>
{:else if filteredProducts.length === 0}
    <div class="bg-white rounded-3 shadow-sm text-center p-5">
        <i class="bi bi-inbox text-muted" style="font-size:4rem;opacity:.5;"
        ></i>
        <h4 class="text-muted mt-3">No se encontraron productos</h4>
        <p class="text-muted mb-0">
            {#if searchTerm || selectedCategory !== "all"}
                Intenta con otros términos o categorías.
            {:else}
                Aún no hay productos registrados.
            {/if}
        </p>
    </div>
{:else}
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {#each filteredProducts as producto (producto.id)}
            <div class="col" in:fade>
                <!-- CARD MODIFICADA -->
                <div
                    class="card h-100 shadow-sm border-0 position-relative producto-card"
                    on:click={() => toggleMenu(producto.id)}
                >
                    <!-- IMAGEN -->
                    <div class="ratio ratio-16x9 bg-light">
                        {#if producto.imagen}
                            <img
                                src={producto.imagen}
                                class="card-img-top object-fit-cover"
                                alt={producto.nombre}
                                loading="lazy"
                            />
                        {:else}
                            <div
                                class="d-flex justify-content-center align-items-center h-100"
                            >
                                <i
                                    class="bi bi-image text-muted"
                                    style="font-size:2rem;opacity:.5;"
                                ></i>
                            </div>
                        {/if}
                    </div>

                    <div class="card-body d-flex flex-column">
                        <!-- MENÚ CONTEXTUAL -->
                        {#if selectedProductId === producto.id}
                            <div
                                class="position-absolute top-0 end-0 p-2 d-flex gap-2"
                            >
                                <button
                                    class="btn btn-sm btn-warning"
                                    on:click|stopPropagation={() =>
                                        openEditProductModal(producto)}
                                >
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button
                                    class="btn btn-sm btn-danger"
                                    on:click|stopPropagation={() =>
                                        handleDeleteProduct(producto)}
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        {/if}

                        <div
                            class="d-flex justify-content-between align-items-start mb-2"
                        >
                            <h5
                                class="card-title mb-0 text-truncate"
                                title={producto.nombre}
                            >
                                {producto.nombre}
                            </h5>
                        </div>

                        {#if producto.descripcion}
                            <p
                                class="text-muted small mb-3"
                                title={producto.descripcion}
                            >
                                {producto.descripcion}
                            </p>
                        {/if}

                        <ul class="list-unstyled small mb-3">
                            <li class="mb-1">
                                <strong>Costo:</strong>
                                <span class="text-muted">
                                    {formatCurrency(producto.costoProd || 0)}
                                </span>
                            </li>

                            <li class="mb-1">
                                <strong>Precio Venta:</strong>
                                <span class="text-success fw-bold">
                                    {formatCurrency(producto.precio || 0)}
                                </span>
                            </li>

                            <li class="mb-1">
                                <strong>Stock:</strong>
                                <span
                                    class={producto.stock > 10
                                        ? "text-success"
                                        : producto.stock > 0
                                          ? "text-warning"
                                          : "text-danger"}
                                >
                                    {producto.stock > 0
                                        ? `${producto.stock} unidades`
                                        : "Agotado"}
                                </span>
                            </li>

                            <li class="mb-1">
                                <strong>Categoría:</strong>
                                {#if producto.categoria}
                                    {producto.categoria}
                                {:else}
                                    <span class="text-muted">Sin categoría</span
                                    >
                                {/if}
                            </li>

                            <li>
                                <strong>URL Imagen:</strong>
                                {#if producto.imagen}
                                    <a
                                        href={producto.imagen}
                                        target="_blank"
                                        class="text-primary text-decoration-none"
                                    >
                                        Ver imagen
                                    </a>
                                {:else}
                                    <span class="text-muted"
                                        >No proporcionada</span
                                    >
                                {/if}
                            </li>
                        </ul>

                        <div class="mt-auto d-flex justify-content-between">
                            {#if producto.categoria}
                                <span class="badge bg-light text-muted border"
                                    >{producto.categoria}</span
                                >
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <div class="mt-4 text-muted small">
        Mostrando {filteredProducts.length} de {productos.length} productos
    </div>
{/if}
