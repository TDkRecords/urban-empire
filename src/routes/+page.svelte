<script>
    import Logo from "$lib/assets/images/logo.jpg";
    import Prod1 from "$lib/assets/images/prod-1.jpg";
    import Prod2 from "$lib/assets/images/prod-2.jpg";
    import Prod3 from "$lib/assets/images/prod-3.jpg";
    import { fade, fly, scale } from "svelte/transition";
</script>

<main class="container my-4" in:fade={{ duration: 500 }}>
    <!-- Hero Intro -->
    <div
        class="row bg-white d-flex justify-content-center align-items-center rounded-3 m-2 p-4"
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
                class="FontTitle intro-title"
                in:fade={{ delay: 200, duration: 600 }}
            >
                Urban Empire
            </h1>
            <p
                class="FontBody intro-text"
                in:fade={{ delay: 400, duration: 600 }}
            >
                En Urban Empire fusionamos la esencia urbana con el diseño
                vanguardista. Somos más que una marca de ropa: un movimiento que
                redefine el streetwear contemporáneo. Nuestras colecciones
                cuidadosamente curadas combinan calidad premium con silhouettes
                audaces, creadas para quienes buscan destacar en el asfalto.
                Desde hoodies oversize hasta jeans destrozados con precisión,
                cada pieza cuenta una historia de rebeldía y autenticidad.
                Trabajamos con materiales sostenibles y artesanos locales para
                ofrecerte prendas que desafían las temporadas y trascienden
                tendencias pasajeras.
            </p>
        </div>
    </div>

    <!-- ¿Por qué elegirnos? & ¿Qué ofrecemos? -->
    <div
        class="row mx-2 bg-white rounded-3 text-center p-4 justify-content-center align-items-center"
        in:fade={{ duration: 500 }}
    >
        <div
            class="col-md-6 d-flex align-items-center justify-content-center flex-column"
            in:fly={{ y: 50, duration: 600 }}
        >
            <h1
                class="mb-4 FontTitle section-title"
                in:fly={{ y: -20, duration: 500, delay: 200 }}
            >
                ¿Por qué elegirnos?
            </h1>
            <div
                class="custom-list FontBody"
                in:fade={{ delay: 400, duration: 600 }}
            >
                <p class="lead">
                    En Urban Empire no seguimos modas, las creamos. Nuestro
                    diferencial está en:
                </p>
                <ul class="list-unstyled">
                    <li
                        class="d-flex align-items-start mb-3 list-item"
                        in:fly={{ x: -20, duration: 400, delay: 600 }}
                    >
                        <span class="bullet-icon me-1">✓</span>
                        <span
                            >Tejidos tecnológicos con <em>protección UV</em> y tratamiento
                            antiarrugas</span
                        >
                    </li>
                    <li
                        class="d-flex align-items-start mb-3 list-item"
                        in:fly={{ x: -20, duration: 400, delay: 800 }}
                    >
                        <span class="bullet-icon me-1">✓</span>
                        <span
                            >Envíos express gratuitos en compras superiores a <span
                                class="badge bg-dark">$99</span
                            ></span
                        >
                    </li>
                    <li
                        class="d-flex align-items-start list-item"
                        in:fly={{ x: -20, duration: 400, delay: 1000 }}
                    >
                        <span class="bullet-icon me-1">✓</span>
                        <span
                            >Programa de reciclaje: <span class="highlight"
                                >15% descuento</span
                            > al traer prendas usadas</span
                        >
                    </li>
                </ul>
            </div>

            <h1
                class="mt-5 mb-4 FontTitle section-title"
                in:fly={{ y: 20, duration: 500, delay: 1200 }}
            >
                ¿Qué ofrecemos?
            </h1>
            <div
                class="row row-cols-1 row-cols-md-2 g-4 FontBody offerings"
                in:fade={{ delay: 1400, duration: 600 }}
            >
                {#each [{ title: "Streetwear Premium", items: ["Hoodies oversize", "Bombers técnicos", "Joggers multifunción"] }, { title: "Denim Artesanal", items: ["Lavados únicos", "Roturas láser", "Ajuste perfecto"] }, { title: "Colaboraciones", items: ["Zapatillas artistas urbanos", "Ediciones coleccionables"] }, { title: "Accesorios", items: ["Cadenas gruesas titanio", "Gorras dad hat"] }] as offer, i}
                    <div
                        class="col"
                        in:fly={{ y: 30, duration: 500, delay: 1600 + i * 200 }}
                    >
                        <div class="card h-100 border-0 hover-card">
                            <div
                                class="card-body"
                                in:scale={{
                                    duration: 400,
                                    delay: 1800 + i * 200,
                                }}
                            >
                                <h5 class="card-title">{offer.title}</h5>
                                <ul class="list-group list-group-flush">
                                    {#each offer.items as item}
                                        <li class="list-group-item FontBody">
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
        <div class="col-md-6" in:fly={{ x: 200, duration: 600, delay: 1000 }}>
            <div
                id="carouselExampleCaptions"
                class="carousel slide"
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
                            class="carousel-caption d-none d-md-block bg-dark bg-opacity-50"
                        >
                            <h5>Drop Otoño/Invierno '24</h5>
                            <p>
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
                            class="carousel-caption d-none d-md-block bg-dark bg-opacity-50"
                        >
                            <h5>Colaboración con Kriptik</h5>
                            <p>Prendas pintadas a mano por artistas urbanos</p>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img
                            src={Prod3}
                            class="d-block w-100 img-fluid"
                            alt="Techwear"
                        />
                        <div
                            class="carousel-caption d-none d-md-block bg-dark bg-opacity-50"
                        >
                            <h5>Techwear Essentials</h5>
                            <p>
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
                    <span class="carousel-control-prev-icon" aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">Anterior</span>
                </button>
                <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="next"
                >
                    <span class="carousel-control-next-icon" aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">Siguiente</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Info Blocks -->
    <div
        class="row bg-white p-4 m-2 rounded info-blocks"
        in:fade={{ duration: 500, delay: 200 }}
    >
        <div
            class="col-md-4 p-4 block-item"
            in:fly={{ y: 30, duration: 500, delay: 400 }}
        >
            <h3 class="FontTitle">Style Guide Urbano</h3>
            <p class="FontBody">
                ¿Necesitas inspiración? Nuestro equipo de stylists creó looks
                signature combinando piezas clave. Aprende a layerear como pro
                con nuestras parkas multifuncionales o cómo balancear siluetas
                oversize. Descarga nuestro lookbook digital gratuito.
            </p>
        </div>
        <div
            class="col-md-4 p-4 block-item"
            in:fly={{ y: 30, duration: 500, delay: 600 }}
        >
            <h3 class="FontTitle">Moda Circular</h3>
            <p class="FontBody">
                Comprometidos con el planeta: usamos algodón 100% reciclado y
                poliéster de botellas oceánicas. Nuestro programa Upcycle
                permite personalizar prendas antiguas en nuestro taller Madrid.
            </p>
        </div>
        <div
            class="col-md-4 p-4 block-item"
            in:fly={{ y: 30, duration: 500, delay: 800 }}
        >
            <h3 class="FontTitle">Urban Community</h3>
            <p class="FontBody">
                Únete a nuestro Discord para acceso early a drops, meetups con
                diseñadores y sorteos exclusivos. Comparte tus outfits con
                #UrbanEmpireTribe y destaca en nuestro feed.
            </p>
        </div>
    </div>

    <!-- Accordion -->
    <div
        class="accordion m-2"
        id="accordionExample"
        in:fade={{ duration: 500, delay: 400 }}
    >
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button
                    class="accordion-button FontTitle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne">Política de Envíos</button
                >
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show">
                <div class="accordion-body FontBody">
                    Entregas en 24-48h (Península) mediante MRW. Envíos
                    internacionales con DHL Express. Tracking en tiempo real
                    disponible desde tu cuenta. Retrasos por aduanas? Te
                    gestionamos la documentación sin coste adicional.
                </div>
            </div>
        </div>
        <div
            class="accordion-item"
            in:fly={{ y: 20, duration: 500, delay: 600 }}
        >
            <h2 class="accordion-header">
                <button
                    class="accordion-button collapsed FontTitle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo">Guía de Tallas</button
                >
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse">
                <div class="accordion-body FontBody">
                    Nuestras tallas siguen medidas coreanas (oversize). Usa
                    nuestro configurador 3D: sube una foto frontal y lateral
                    para recomendación precisa. ¿Entre dos tallas? Te
                    aconsejamos bajar una si prefieres fit ajustado.
                </div>
            </div>
        </div>
        <div
            class="accordion-item"
            in:fly={{ y: 20, duration: 500, delay: 800 }}
        >
            <h2 class="accordion-header">
                <button
                    class="accordion-button collapsed FontTitle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree">Devoluciones Premium</button
                >
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse">
                <div class="accordion-body FontBody">
                    30 días para cambios gratuitos. Solicita recogida en
                    domilicio o usa nuestro network de lockers 24h. Reembolsos
                    en 3h vía Bizum o 24h a tarjeta. ¿Prenda defectuosa?
                    Reposición inmediata + 20% de descuento.
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .logo-img {
        width: 100%;
        max-width: 420px;
        animation: rotateIn 1s ease-out;
    }
    @keyframes rotateIn {
        from {
            transform: rotate(-200deg);
            opacity: 0;
        }
        to {
            transform: rotate(0);
            opacity: 1;
        }
    }
    .hover-card {
        transition:
            transform 0.3s,
            box-shadow 0.3s;
    }
    .hover-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
    .bullet-icon {
        color: #00ccff;
        font-weight: bold;
    }
    .section-title {
        position: relative;
    }
    .section-title::after {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 50%;
        width: 50px;
        height: 3px;
        background: #00ccff;
        transform: translateX(-50%) scaleX(0);
        transform-origin: center;
        transition: transform 300ms ease-out;
    }
    .section-title:hover::after {
        transform: translateX(-50%) scaleX(1);
    }
</style>
