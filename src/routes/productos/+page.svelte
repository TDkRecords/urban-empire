<script>
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { cart } from "$lib/stores/cart";
    import { getProducts } from "$lib/services/productService";

    let products = [];
    let selectedProduct = null;
    let selectedSize = null;
    let selectedColor = null;
    let loading = true;
    let error = null;
    let addingToCart = false;

    // Obtener productos de Firebase al cargar el componente
    onMount(async () => {
        try {
            products = await getProducts();
            loading = false;
        } catch (err) {
            console.error("Error al cargar productos:", err);
            error =
                "No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.";
            loading = false;
        }
    });

    function openModal(product) {
        selectedProduct = product;
    }

    function closeModal() {
        selectedProduct = null;
    }

    async function addToCart(product) {
        if (addingToCart) return;
        
        addingToCart = true;
        try {
            // Validar que el producto tenga stock
            if (product.stock <= 0) {
                alert('Este producto no tiene stock disponible');
                addingToCart = false;
                return;
            }

            await cart.addToCart({
                ...product,
                // Mapear los campos según la estructura del dashboard
                title: product.nombre || product.title || 'Producto sin nombre',
                nombre: product.nombre || product.title || 'Producto sin nombre',
                description: product.descripcion || product.description || '',
                descripcion: product.descripcion || product.description || '',
                price: typeof product.precio === 'number' 
                    ? `$${product.precio.toLocaleString('es-CO')}` 
                    : (product.price || '$0'),
                precio: typeof product.precio === 'number' ? product.precio : parseFloat(product.price) || 0,
                imageUrl: product.imagen || product.imageUrl || product.image || '',
                imagen: product.imagen || product.imageUrl || product.image || '',
                stock: parseInt(product.stock) || 0,
                // Mantener la categoría si existe
                categoria: product.categoria || '',
                ...(selectedSize && { selectedSize }),
                ...(selectedColor && { selectedColor })
            });
            
            // Cerrar modal después de agregar
            setTimeout(() => {
                closeModal();
                selectedSize = null;
                selectedColor = null;
            }, 500);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            alert('Error al agregar el producto al carrito. Por favor, inicia sesión primero.');
        } finally {
            addingToCart = false;
        }
    }
</script>

<main class="bg-personalizado w-100 h-100">
    <div class="container py-5" in:fade={{ duration: 500 }}>
        <div
            class="text-center text-light mb-5 p-4 bg-transparent-blur"
            in:fly={{ y: -20, duration: 600 }}
        >
            <h1 class="FontTitle section-title">Nuestros Productos</h1>
            <p class="FontBody lead" in:fade={{ delay: 200, duration: 600 }}>
                Descubre nuestra colección de streetwear y techwear diseñados
                para destacar.
            </p>
        </div>

        {#if loading}
            <div class="text-center py-5">
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="text-light mt-3">Cargando productos...</p>
            </div>
        {:else if error}
            <div class="alert alert-danger">
                {error}
            </div>
        {:else if products.length === 0}
            <div class="text-center py-5">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    fill="currentColor"
                    class="bi bi-box-seam text-light mb-3"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"
                    />
                </svg>
                <h3 class="text-light">No hay productos disponibles</h3>
                <p class="text-light">
                    Pronto agregaremos nuevos productos a nuestra tienda.
                </p>
            </div>
        {:else}
            <div class="row row-cols-1 row-cols-md-3 g-4">
                {#each products as product, i}
                    <div
                        class="col"
                        in:fly={{ y: 50, duration: 600, delay: i * 100 }}
                    >
                        <div
                            class="card h-100 border-0 product-card shadow-lg"
                            in:scale={{ duration: 400, delay: 300 + i * 100 }}
                        >
                            <div class="card-img-wrapper position-relative overflow-hidden">
                                {#if product.imagen || product.imageUrl}
                                    <img
                                        src={product.imagen || product.imageUrl}
                                        class="card-img-top img-fluid"
                                        alt={product.nombre || product.title || 'Producto'}
                                        on:error={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                                        }}
                                    />
                                {:else}
                                    <div
                                        class="bg-gradient d-flex align-items-center justify-content-center"
                                        style="height: 350px;"
                                    >
                                        <span class="text-white fs-5">Sin imagen</span>
                                    </div>
                                {/if}
                                {#if product.stock <= 5 && product.stock > 0}
                                    <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3">
                                        ¡Últimas unidades!
                                    </span>
                                {:else if product.stock === 0}
                                    <span class="badge bg-danger position-absolute top-0 end-0 m-3">
                                        Agotado
                                    </span>
                                {/if}
                            </div>
                            <div class="card-body d-flex flex-column">
                                <div class="mb-2">
                                    {#if product.categoria}
                                        <span class="badge bg-secondary mb-2">{product.categoria}</span>
                                    {/if}
                                </div>
                                <h5 class="card-title FontTitle fw-bold mb-2">
                                    {product.nombre || product.title}
                                </h5>
                                <p
                                    class="card-text FontBody text-muted flex-grow-1"
                                    style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;"
                                >
                                    {product.descripcion || product.description || 'Sin descripción'}
                                </p>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <span class="FontTitle price fs-4 fw-bold text-primary">
                                        {typeof product.precio === "number"
                                            ? `$${product.precio.toLocaleString("es-CO")}`
                                            : (product.price || '$0')}
                                    </span>
                                    <button
                                        on:click={() => openModal(product)}
                                        class="btn btn-primary btn-modern"
                                        disabled={product.stock === 0}
                                    >
                                        <i class="bi bi-eye me-1"></i>
                                        Ver más
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        {#if selectedProduct}
            <div class="modal-overlay" on:click={closeModal} in:fade out:fade>
                <div
                    class="modal-content"
                    on:click|stopPropagation
                    in:fly={{ y: 200, duration: 400 }}
                    style="max-width: 90%; max-height: 90vh; overflow-y: auto;"
                >
                    <button class="modal-close" on:click={closeModal}>
                        &times;
                    </button>

                    <div class="row">
                        <div class="col-md-6">
                            {#if selectedProduct.imagen || selectedProduct.imageUrl}
                                <img
                                    src={selectedProduct.imagen || selectedProduct.imageUrl}
                                    alt={selectedProduct.nombre || selectedProduct.title || 'Producto'}
                                    class="img-fluid rounded mb-3"
                                    style="max-height: 400px; width: 100%; object-fit: contain;"
                                    on:error={(e) => {
                                        e.target.src = 'https://via.placeholder.com/500x500?text=Imagen+no+disponible';
                                    }}
                                />
                            {:else}
                                <div
                                    class="bg-light d-flex align-items-center justify-content-center"
                                    style="height: 300px;"
                                >
                                    <span class="text-muted">Sin imagen</span>
                                </div>
                            {/if}
                        </div>
                        <div class="col-md-6">
                            <h2 class="FontTitle mb-3">
                                {selectedProduct.nombre || selectedProduct.title}
                            </h2>
                            {#if selectedProduct.categoria}
                                <div class="mb-2">
                                    <span class="badge bg-secondary">{selectedProduct.categoria}</span>
                                </div>
                            {/if}
                            <p class="FontBody mb-3">
                                {selectedProduct.descripcion || selectedProduct.description}
                            </p>

                            <div class="mb-4">
                                <h4 class="FontTitle price mb-3">
                                    Precio: {typeof selectedProduct.precio === "number"
                                        ? `$${selectedProduct.precio.toLocaleString("es-CO")}`
                                        : (selectedProduct.price || '$0')}
                                </h4>

                                {#if selectedProduct.stock > 0}
                                    <p class="text-success">
                                        <i class="bi bi-check-circle-fill"></i>
                                        En stock ({selectedProduct.stock} disponibles)
                                    </p>
                                {:else}
                                    <p class="text-danger">
                                        <i class="bi bi-x-circle-fill"></i> Sin stock
                                    </p>
                                {/if}

                                {#if selectedProduct.sizes && selectedProduct.sizes.length > 0}
                                    <div class="mb-3">
                                        <label class="form-label"
                                            >Tallas disponibles:</label
                                        >
                                        <div class="d-flex flex-wrap gap-2">
                                            {#each selectedProduct.sizes as size}
                                                <button
                                                    class="btn btn-outline-dark btn-sm"
                                                    class:active={selectedSize ===
                                                        size}
                                                    on:click={() =>
                                                        (selectedSize = size)}
                                                >
                                                    {size}
                                                </button>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}

                                {#if selectedProduct.colors && selectedProduct.colors.length > 0}
                                    <div class="mb-3">
                                        <label class="form-label"
                                            >Colores:</label
                                        >
                                        <div class="d-flex flex-wrap gap-2">
                                            {#each selectedProduct.colors as color}
                                                <button
                                                    class="btn btn-sm rounded-circle"
                                                    style={`width: 30px; height: 30px; background-color: ${color};`}
                                                    class:border-2={selectedColor ===
                                                        color}
                                                    class:border-primary={selectedColor ===
                                                        color}
                                                    on:click={() =>
                                                        (selectedColor = color)}
                                                    title={color}
                                                ></button>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            </div>

                            <div class="d-flex gap-2">
                                <button
                                    class="btn btn-primary flex-grow-1"
                                    on:click={() => addToCart(selectedProduct)}
                                    disabled={selectedProduct.stock <= 0 || addingToCart}
                                >
                                    {#if addingToCart}
                                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Agregando...
                                    {:else}
                                        <i class="bi bi-cart-plus me-2"></i>
                                        Añadir al carrito
                                    {/if}
                                </button>
                                <button
                                    class="btn btn-outline-secondary"
                                    on:click={closeModal}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</main>

<style>
    .bg-personalizado {
        background: url("/src/lib/assets/images/gengar-2.jpg");
        background-size: 218px;
        background-position: center;
        background-attachment: fixed;
        background-repeat: repeat;
        min-height: calc(100vh - 56px); /* Ajustar según el tamaño del navbar */
    }

    .bg-transparent-blur {
        backdrop-filter: blur(21px);
        border: 1px solid white;
        border-radius: 16px;
    }

    .product-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        background: white;
        border-radius: 16px;
        overflow: hidden;
    }

    .product-card:hover {
        transform: translateY(-12px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .card-img-wrapper {
        position: relative;
        height: 350px;
        overflow: hidden;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .card-img-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .product-card:hover .card-img-wrapper img {
        transform: scale(1.1);
    }

    .price {
        font-size: 1.75rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
    }

    .btn-modern {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        padding: 0.5rem 1.25rem;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-modern:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    .btn-modern:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .badge {
        font-size: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        font-weight: 600;
    }

    .card-body {
        padding: 1.5rem;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        width: 100%;
        max-width: 900px;
        position: relative;
    }

    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6c757d;
    }

    .modal-close:hover {
        color: #0d6efd;
    }

    .text-truncate-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .section-title {
        position: relative;
        display: inline-block;
    }
    
    .section-title::after {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 50%;
        width: 60px;
        height: 4px;
        background: #00ccff;
        transform: translateX(-50%) scaleX(0);
        transform-origin: center;
        transition: transform 300ms ease-out;
    }
    
    .section-title:hover::after {
        transform: translateX(-50%) scaleX(1);
    }

    @media (max-width: 768px) {
        .bg-personalizado {
            background-size: 150px;
        }
        
        .modal-content {
            padding: 1rem;
            max-width: 95%;
        }

        .modal-content .row {
            flex-direction: column;
        }

        .modal-content img {
            max-height: 300px !important;
            margin-bottom: 1rem;
        }
        
        .d-flex.gap-2 {
            flex-direction: column;
        }
        
        .d-flex.gap-2 .btn {
            width: 100%;
        }
    }
</style>
