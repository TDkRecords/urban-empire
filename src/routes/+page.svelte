<script>
    import Logo from "$lib/assets/images/favicon.jpeg";
    import Prod1 from "$lib/assets/images/prod-1.jpg";
    import Prod2 from "$lib/assets/images/prod-2.jpg";
    import Prod3 from "$lib/assets/images/prod-3.jpg";
    import { fade, fly, scale } from "svelte/transition";

    const accordionItems = [
        {
            title: "Política de Envíos",
            content: `Entregas en 24-48h. Te gestionamos la documentación sin coste adicional.`,
        },
        {
            title: "Guía de Tallas",
            content: `Nuestras tallas siguen medidas oversize. Usa nuestro configurador 3D: sube una foto frontal y lateral para recomendación precisa. ¿Entre dos tallas? Te aconsejamos bajar una si prefieres fit ajustado.`,
        },
        {
            title: "Devoluciones Premium",
            content: `30 días para cambios gratuitos. Solicita recogida en domicilio. ¿Prenda defectuosa? Reposición inmediata + 15% de descuento.`,
        },
    ];
</script>

<main class="w-100 h-100 bg-personalizado">
    <div class="container py-4">
        <div
            class="row purple-700 text-light d-flex justify-content-center align-items-center rounded-3 m-2 p-4"
            in:fly={{ y: -50, duration: 600 }}
        >
            <div
                class="col-md-6 d-flex justify-content-center align-items-center"
                in:fly={{ x: -200, duration: 600 }}
            >
                <img
                    src={Logo}
                    alt="Colección Urban Empire"
                    class="img-fluid rounded-circle logo-img"
                />
            </div>
            <div class="col-md-6 text-end" in:fly={{ x: 200, duration: 600 }}>
                <h1
                    class="FontTitle intro-title text-light"
                    in:fade={{ delay: 200, duration: 600 }}
                >
                    Urban Empire
                </h1>
                <p
                    class="FontBody intro-text text-light"
                    in:fade={{ delay: 400, duration: 600 }}
                >
                    En Urban Empire fusionamos la esencia urbana con el diseño
                    vanguardista. Somos más que una marca de ropa: un movimiento
                    que redefine el streetwear contemporáneo. Nuestras
                    colecciones cuidadosamente curadas combinan calidad premium
                    con silhouettes audaces, creadas para quienes buscan
                    destacar en el asfalto. Desde hoodies oversize hasta jeans
                    destrozados con precisión, cada pieza cuenta una historia de
                    rebeldía y autenticidad. Trabajamos con materiales
                    sostenibles y artesanos locales para ofrecerte prendas que
                    desafían las temporadas y trascienden tendencias pasajeras.
                </p>
            </div>
        </div>

        <!-- ¿Por qué elegirnos? & ¿Qué ofrecemos? -->
        <div
            class="row mx-2 purple-700 rounded-3 text-center p-4 slate-gray d-flex align-items-center justify-content-center"
            in:fade={{ duration: 500 }}
        >
            <div
                class="col-md-6 d-flex align-items-center justify-content-center flex-column"
                in:fly={{ y: 50, duration: 600 }}
            >
                <h1
                    class="mb-4 FontTitle section-title text-dark"
                    in:fly={{ y: -20, duration: 500, delay: 200 }}
                >
                    ¿Por qué elegirnos?
                </h1>
                <div
                    class="custom-list FontBody text-dark"
                    in:fade={{ delay: 400, duration: 600 }}
                >
                    <p class="lead">
                        En Urban Empire no seguimos modas, las creamos. Nuestro
                        diferencial está en:
                    </p>
                    <ul class="list-unstyled">
                        <li
                            class="d-flex align-items-start mb-3"
                            in:fly={{ x: -20, duration: 400, delay: 600 }}
                        >
                            <span class="bullet-icon me-1 accent-gold"></span>
                            <span
                                >Tejidos tecnológicos con <em>protección UV</em>
                                y tratamiento antiarrugas</span
                            >
                        </li>
                        <li
                            class="d-flex align-items-start mb-3"
                            in:fly={{ x: -20, duration: 400, delay: 800 }}
                        >
                            <span class="bullet-icon me-1 accent-gold"></span>
                            <span
                                >Envíos express gratuitos en compras superiores
                                a <span class="badge purple-500 text-light">
                                    $240.000
                                </span></span
                            >
                        </li>
                        <li
                            class="d-flex align-items-start"
                            in:fly={{ x: -20, duration: 400, delay: 1000 }}
                        >
                            <span class="bullet-icon me-1 accent-gold"></span>
                            <span
                                >Programa de reciclaje: <span
                                    class="highlight purple-500 text-light"
                                    >15% descuento</span
                                > al traer prendas usadas</span
                            >
                        </li>
                    </ul>
                </div>

                <h1
                    class="mt-5 mb-4 FontTitle section-title text-dark"
                    in:fly={{ y: 20, duration: 500, delay: 1200 }}
                >
                    ¿Qué ofrecemos?
                </h1>
                <div
                    class="row row-cols-1 row-cols-md-2 g-4 FontBody"
                    in:fade={{ delay: 1400, duration: 600 }}
                >
                    {#each [{ title: "Streetwear Premium", items: ["Hoodies oversize", "Bombers técnicos", "Joggers multifunción"] }, { title: "Denim Artesanal", items: ["Lavados únicos", "Roturas láser", "Ajuste perfecto"] }, { title: "Colaboraciones", items: ["Zapatillas artistas urbanos", "Ediciones coleccionables"] }, { title: "Accesorios", items: ["Cadenas gruesas titanio", "Gorras dad hat"] }] as offer, i}
                        <div
                            class="col"
                            in:fly={{
                                y: 30,
                                duration: 500,
                                delay: 1600 + i * 200,
                            }}
                        >
                            <div class="card h-100 border-0">
                                <div
                                    class="card-body lavender-300 rounded shadow-sm"
                                    in:scale={{
                                        duration: 400,
                                        delay: 1800 + i * 200,
                                    }}
                                >
                                    <h5
                                        class="card-title text-dark slate-gray rounded-3"
                                    >
                                        {offer.title}
                                    </h5>
                                    <ul
                                        class="list-group list-group-flush bg-transparent"
                                    >
                                        {#each offer.items as item}
                                            <li
                                                class="list-group-item text-dark lavender-300"
                                            >
                                                {item}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <!-- Carousel -->
            <div
                class="col-md-6"
                in:fly={{ x: 200, duration: 600, delay: 1000 }}
            >
                <div
                    id="carouselExampleCaptions"
                    class="carousel slide rounded py-4"
                    in:fade={{ duration: 600, delay: 1200 }}
                >
                    <div class="carousel-indicators">
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="0"
                            class="active"
                            aria-current="true"
                            aria-label="Slide 1"
                        ></button>
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="1"
                            aria-label="Slide 2"
                        ></button>
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="2"
                            aria-label="Slide 3"
                        ></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img
                                src={Prod1}
                                class="d-block w-100 img-fluid"
                                alt="Nueva Colección"
                            />
                            <div
                                class="carousel-caption d-none d-md-block slate-gray bg-opacity-75 rounded p-2"
                            >
                                <h5 class="text-dark">
                                    Drop Otoño/Invierno '24
                                </h5>
                                <p class="text-dark">
                                    Prendas térmicas con tecnología graphene
                                    infusion
                                </p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img
                                src={Prod2}
                                class="d-block w-100 img-fluid"
                                alt="Edición Limitada"
                            />
                            <div
                                class="carousel-caption d-none d-md-block slate-gray bg-opacity-75 rounded p-2"
                            >
                                <h5 class="text-dark">
                                    Colaboración con Kriptik
                                </h5>
                                <p class="text-dark">
                                    Prendas pintadas a mano por artistas urbanos
                                </p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img
                                src={Prod3}
                                class="d-block w-100 img-fluid"
                                alt="Techwear"
                            />
                            <div
                                class="carousel-caption d-none d-md-block slate-gray bg-opacity-75 rounded p-2"
                            >
                                <h5 class="text-dark">Techwear Essentials</h5>
                                <p class="text-dark">
                                    Diseños multifuncionales con compartimentos
                                    estratégicos
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        class="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="prev"
                    >
                        <span
                            class="carousel-control-prev-icon"
                            aria-hidden="true"
                        ></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button
                        class="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="next"
                    >
                        <span
                            class="carousel-control-next-icon"
                            aria-hidden="true"
                        ></span>
                        <span class="visually-hidden">Siguiente</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Info Blocks -->
        <div
            class="row purple-700 text-light p-4 m-2 rounded"
            in:fade={{ duration: 500, delay: 200 }}
        >
            <div
                class="col-md-4 p-4"
                in:fly={{ y: 30, duration: 500, delay: 400 }}
            >
                <h3 class="FontTitle text-light">Style Guide Urbano</h3>
                <p class="FontBody text-light">
                    ¿Necesitas inspiración? Nuestro equipo de stylists creó
                    looks signature combinando piezas clave. Aprende a layerear
                    como pro con nuestras parkas multifuncionales o cómo
                    balancear siluetas oversize. Descarga nuestro lookbook
                    digital gratuito.
                </p>
            </div>
            <div
                class="col-md-4 p-4"
                in:fly={{ y: 30, duration: 500, delay: 600 }}
            >
                <h3 class="FontTitle text-light">Moda Circular</h3>
                <p class="FontBody text-light">
                    Comprometidos con el planeta: usamos algodón 100% reciclado
                    y poliéster de botellas oceánicas. Nuestro programa Upcycle
                    permite personalizar prendas antiguas en nuestro taller
                    Madrid.
                </p>
            </div>
            <div
                class="col-md-4 p-4"
                in:fly={{ y: 30, duration: 500, delay: 800 }}
            >
                <h3 class="FontTitle text-light">Urban Community</h3>
                <p class="FontBody text-light">
                    Únete a nuestro Discord para acceso early a drops, meetups
                    con diseñadores y sorteos exclusivos. Comparte tus outfits
                    con #UrbanEmpireTribe y destaca en nuestro feed.
                </p>
            </div>
        </div>

        <!-- Accordion -->
        <div class="accordion" id="accordionExample" in:fade>
            {#each accordionItems as item, i}
                <div
                    class="accordion-item lavender-300 rounded border"
                    in:fly={{ y: 20, duration: 500, delay: 600 + i * 200 }}
                >
                    <h2 class="accordion-header">
                        <button
                            class="accordion-button purple-500 text-light"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapse{i}"
                            aria-expanded={i === 0 ? "true" : "false"}
                            aria-controls="collapse{i}"
                        >
                            {item.title}
                        </button>
                    </h2>
                    <div
                        id="collapse{i}"
                        class="accordion-collapse collapse {i === 0
                            ? 'show'
                            : ''} "
                        data-bs-parent="#accordionExample"
                    >
                        <div class="accordion-body slate-gray text-dark">
                            {item.content}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</main>

<style>
    .bg-personalizado {
        background: url("/src/lib/assets/images/gengar.jpg");
        background-size: 648px;
        background-position: center;
        background-attachment: fixed;
        background-repeat: repeat;
    }
    .logo-img {
        width: 100%;
        max-width: 360px;
        animation: rotateIn 1s ease-out;
    }
    @keyframes rotateIn {
        from {
            transform: rotate(-180deg);
            opacity: 0;
        }
        to {
            transform: rotate(0);
            opacity: 1;
        }
    }
    .bullet-icon {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;

        background-color: #f8c555;
        margin-top: 6px;
    }
    .section-title {
        position: relative;
    }
    .section-title::after {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 50%;
        width: 60px;
        height: 4px;
        background: #8f52c1;
        transform: translateX(-50%);
    }
</style>
