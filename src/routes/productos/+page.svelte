<script>
    import "../../app.css";
    import Prod1 from "$lib/assets/images/prod-1.jpg";
    import Prod2 from "$lib/assets/images/prod-2.jpg";
    import Prod3 from "$lib/assets/images/prod-3.jpg";
    import Prod4 from "$lib/assets/images/prod-4.jpg";
    import Prod5 from "$lib/assets/images/prod-5.jpg";
    import Prod6 from "$lib/assets/images/prod-6.jpg";
    import Prod7 from "$lib/assets/images/gengar-5.jpg";
    import Prod8 from "$lib/assets/images/prod-8.jpg";
    import Prod9 from "$lib/assets/images/prod-9.jpg";
    import Prod10 from "$lib/assets/images/prod-10.jpg";

    import { fade, fly, scale } from "svelte/transition";
    let selectedProduct = null;
    const products = [
        {
            id: 1,
            title: "Hoodie Oversize Grafiti",
            price: "$205.999",
            image: Prod1,
            description:
                "Sudadera oversize con estampado urbano y tejidos técnicos resistentes.",
        },
        {
            id: 2,
            title: "Jeans Roto Laser",
            price: "$230.999",
            image: Prod2,
            description:
                "Pantalón denim con roturas láser de precisión y ajuste slim.",
        },
        {
            id: 3,
            title: "Bomber Techwear",
            price: "$334.999",
            image: Prod3,
            description:
                "Chaqueta bomber multifuncional con bolsillos estratégicos y paneles repelentes.",
        },
        {
            id: 4,
            title: "Custom Desing",
            image: Prod4,
            price: "$75.999",
            description:
                "Diseños personalizados promoviendo la libertad de expresion dentro del streetwear",
        },
        {
            id: 5,
            title: "Conjuntos style type",
            image: Prod5,
            price: "$189.999",
            description:
                "Conjuntos de artistas que promueven la marca Urban Empire con su estilo promoviendo nuestra esencia",
        },
        {
            id: 6,
            title: "Fusion Cultural",
            image: Prod6,
            price: "$59.999",
            description:
                "Prendas que fusionan la cultura otaku con la cultura urbana sin dejar de lado la elegancia",
        },
        {
            id: 7,
            title: "Indie Street",
            image: Prod7,
            price: "$64.999",
            description: "Introducción al estilo indie al estilo urbano",
        },
        {
            id: 8,
            title: "8th School",
            image: Prod8,
            price: "$72.999",
            description:
                "Diseños de 8-bits especializados para gamers old-school que buscan moda, comodidad y nostalgia al mismo tiempo.",
        },
        {
            id: 9,
            title: "Dual Style",
            image: Prod9,
            price: "$146.999",
            description:
                "El arte de compartir entre generos a través de la moda, Dual Style promueve la comunicación visual aportando riquesa a las relaciones interpersonales",
        },
        {
            id: 10,
            title: "Black & White",
            image: Prod10,
            price: "$211.999",
            description:
                "El contraste entre channel y Urban Empire a través del diseño black 6 white, dando esencia única a cada prenda que producimos",
        },
    ];
    function openModal(product) {
        selectedProduct = product;
    }
    function closeModal() {
        selectedProduct = null;
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
                Descubre nuestra colección premium de streetwear y techwear
                diseñados para destacar.
            </p>
        </div>

        <div class="row row-cols-1 row-cols-md-3 g-4">
            {#each products as product, i}
                <div
                    class="col"
                    in:fly={{ y: 50, duration: 600, delay: i * 200 }}
                >
                    <div
                        class="card h-100 border-0 product-card"
                        in:scale={{ duration: 400, delay: 300 + i * 200 }}
                    >
                        <img
                            src={product.image}
                            class="card-img-top img-fluid"
                            alt={product.title}
                        />
                        <div class="card-body text-center">
                            <h5 class="card-title FontTitle">
                                {product.title}
                            </h5>
                            <p class="card-text FontBody small">
                                {product.description}
                            </p>
                        </div>
                        <div
                            class="card-footer bg-white border-0 text-center mb-2"
                        >
                            <span class="FontTitle price">{product.price}</span>
                            <button
                                on:click={() => openModal(product)}
                                class="btn btn-info btn-sm ms-3 view-btn"
                            >
                                Ver más
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        {#if selectedProduct}
            <div class="modal-overlay" on:click={closeModal} in:fade out:fade>
                <div
                    class="modal-content"
                    on:click|stopPropagation
                    in:fly={{ y: 200, duration: 400 }}
                >
                    <button class="modal-close" on:click={closeModal}>
                        &times;
                    </button>
                    <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        class="img-fluid mb-3"
                    />
                    <h2 class="FontTitle mb-2">{selectedProduct.title}</h2>
                    <p class="FontBody mb-2">{selectedProduct.description}</p>
                    <p class="FontTitle price">
                        Precio: {selectedProduct.price}
                    </p>
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
    }

    .bg-transparent-blur {
        backdrop-filter: blur(21px);
        border: 1px solid white;
        border-radius: 16px;
    }
    .product-card {
        transition:
            transform 0.3s,
            box-shadow 0.3s;
        border-radius: 12px;
        overflow: hidden;
    }
    .product-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
    .product-card img {
        object-fit: cover;
        height: 220px;
        width: 100%;
    }
    .price {
        font-size: 1.2rem;
        color: #333;
    }
    .view-btn {
        transition:
            background-color 0.3s,
            transform 0.2s;
    }
    .view-btn:hover {
        background-color: #00ccff;
        transform: scale(1.05);
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

    /* Modal styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1050;
    }
    .modal-content {
        background: #fff;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        position: relative;
        text-align: center;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    .modal-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
</style>
