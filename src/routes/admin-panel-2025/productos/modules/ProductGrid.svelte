<script>
    import { fly } from "svelte/transition";

    export let productos = [];
    export let onEdit = () => {};
    export let onDelete = () => {};
    export let onRestore = () => {};
    export let isDeletedList = false;

    function formatCurrency(amount) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    }
</script>

<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
    {#each productos as producto, i (producto.id)}
        <div class="col" in:fly={{ y: 20, duration: 300, delay: i * 30 }}>
            <div class="card h-100 shadow-sm product-card">
                <!-- Imagen -->
                <div class="product-image-wrapper">
                    {#if producto.imagen}
                        <img
                            src={producto.imagen}
                            class="card-img-top"
                            alt={producto.nombre}
                            on:error={(e) => {
                                e.target.src =
                                    "https://via.placeholder.com/300x200?text=Sin+imagen";
                            }}
                        />
                    {:else}
                        <div class="product-placeholder">
                            <i class="fas fa-image"></i>
                        </div>
                    {/if}
                    <!-- Badge de stock -->
                    {#if producto.stock <= 5 && producto.stock > 0}
                        <span
                            class="badge bg-warning text-dark position-absolute top-0 end-0 m-2"
                        >
                            ¡Pocas unidades!
                        </span>
                    {:else if producto.stock === 0}
                        <span
                            class="badge bg-danger position-absolute top-0 end-0 m-2"
                        >
                            Agotado
                        </span>
                    {/if}
                </div>

                <!-- Contenido -->
                <div class="card-body d-flex flex-column">
                    <!-- Categoría -->
                    {#if producto.categoria}
                        <span class="badge bg-secondary mb-2 align-self-start">
                            {producto.categoria}
                        </span>
                    {/if}

                    <!-- Nombre -->
                    <h5 class="card-title fw-bold mb-2">
                        {producto.nombre}
                    </h5>

                    <!-- Descripción -->
                    {#if producto.descripcion}
                        <p
                            class="card-text text-muted small mb-3 flex-grow-1 text-truncate-3"
                        >
                            {producto.descripcion}
                        </p>
                    {/if}

                    <!-- Precios y Stock -->
                    <div class="mb-3">
                        <div
                            class="d-flex justify-content-between align-items-center mb-1"
                        >
                            <small class="text-muted">Costo:</small>
                            <small>{formatCurrency(producto.costoProd)}</small>
                        </div>
                        <div
                            class="d-flex justify-content-between align-items-center mb-1"
                        >
                            <small class="text-muted">Precio:</small>
                            <strong class="text-success"
                                >{formatCurrency(producto.precio)}</strong
                            >
                        </div>
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <small class="text-muted">Stock:</small>
                            <span
                                class="badge bg-{producto.stock > 10
                                    ? 'success'
                                    : producto.stock > 0
                                      ? 'warning text-dark'
                                      : 'danger'}"
                            >
                                {producto.stock} unidades
                            </span>
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div class="d-flex gap-2">
                        {#if isDeletedList}
                            <button
                                aria-label="Restaurar"
                                class="btn btn-sm btn-outline-success flex-grow-1"
                                on:click={() => onRestore(producto)}
                            >
                                <i class="fas fa-rotate-left"></i>
                                <span class="d-none d-sm-inline ms-1"
                                    >Restaurar</span
                                >
                            </button>
                        {:else}
                            <button
                                class="btn btn-sm btn-outline-primary flex-grow-1"
                                on:click={() => onEdit(producto)}
                            >
                                <i class="fas fa-pen"></i>
                                <span class="d-none d-sm-inline ms-1"
                                    >Editar</span
                                >
                            </button>
                            <button
                                aria-label="Eliminar"
                                class="btn btn-sm btn-outline-danger"
                                on:click={() => onDelete(producto)}
                            >
                                <i class="fas fa-trash"></i>
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    .product-card {
        transition: all 0.3s ease;
        border: none;
        border-radius: 12px;
        overflow: hidden;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
    }

    .product-image-wrapper {
        position: relative;
        height: 200px;
        overflow: hidden;
        background: #f8f9fa;
    }

    .product-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        color: #6c757d;
        font-size: 3rem;
    }

    .text-truncate-3 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-clamp: 3;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .badge {
        font-size: 0.75rem;
        padding: 0.35rem 0.65rem;
    }

    @media (max-width: 576px) {
        .d-flex.gap-2 {
            flex-direction: column;
        }
        .btn.btn-sm {
            width: 100%;
        }
    }
</style>
