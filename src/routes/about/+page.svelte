<script>
    import Logo from "$lib/assets/images/favicon.jpeg";
    import { fade, fly } from "svelte/transition";
</script>

<main class="bg-personalizado">
    <div class="container py-5">
        <!-- Encabezado mejorado -->
        <div
            class="row bg-black rounded-3 p-4 mb-4 container m-auto d-flex justify-content-center align-items-center"
            in:fade={{ duration: 500 }}
        >
            <div
                class="col-md-4 d-flex justify-content-center align-items-center"
                in:fly={{ x: -200, duration: 300 }}
            >
                <img
                    src={Logo}
                    alt="Logo Urban Empire"
                    class="img-fluid rounded-circle intro-img"
                />
            </div>
            <div class="col-md-8" in:fly={{ x: 200, duration: 600 }}>
                <h1 class="FontTitle text-light">Sobre Nosotros</h1>
                <p class="FontBody text-light">
                    Urban Empire es una tienda de streetwear ubicada en Pasto,
                    Nariño, Colombia. Desde 2025, ofrecemos prendas únicas que
                    fusionan la riqueza cultural local con tendencias
                    internacionales.
                </p>
                <p class="FontBody text-light">
                    Nuestras colecciones destacan por su calidad y diseño,
                    utilizando materiales sostenibles y colaborando con
                    artesanos de la región para impulsar la moda local.
                </p>
            </div>
        </div>

        <!-- Misión y Visión -->
        <div class="row mb-5 missions" in:fade={{ duration: 500 }}>
            <div
                class="col-md-6 mb-4 mission-item"
                in:fly={{ y: 100, duration: 600 }}
            >
                <div class="slate-gray rounded-3 p-4 h-100 card-anim">
                    <h2 class="FontTitle text-dark">Misión</h2>
                    <p class="FontBody text-dark">
                        Proveer ropa urbana de alta calidad, con diseño
                        atractivo y producción responsable.
                    </p>
                </div>
            </div>
            <div
                class="col-md-6 mb-4 mission-item"
                in:fly={{ y: 100, duration: 600, delay: 200 }}
            >
                <div class="slate-gray rounded-3 p-4 h-100 card-anim">
                    <h2 class="FontTitle text-dark">Visión</h2>
                    <p class="FontBody text-dark">
                        Consolidarnos como la marca de streetwear sostenible
                        preferida en Colombia y expandirnos a mercados clave en
                        América Latina.
                    </p>
                </div>
            </div>
        </div>

        <!-- Objetivos -->
        <div class="row mb-5" in:fade={{ duration: 500 }}>
            <div class="col-12 text-center mb-4">
                <h2 class="FontTitle text-light">Objetivos</h2>
            </div>
            <div
                class="col-md-4 mb-3 objective-item"
                in:fly={{ x: -100, duration: 500 }}
            >
                <div class="slate-gray rounded-3 p-4 h-100 card-anim">
                    <h5 class="FontTitle text-dark">Colecciones</h5>
                    <p class="FontBody text-dark">
                        Lanzar 3 colecciones anuales con diseños exclusivos.
                    </p>
                </div>
            </div>
            <div
                class="col-md-4 mb-3 objective-item"
                in:fly={{ y: 100, duration: 500, delay: 100 }}
            >
                <div class="slate-gray rounded-3 p-4 h-100 card-anim">
                    <h5 class="FontTitle text-dark">Ventas</h5>
                    <p class="FontBody text-dark">
                        Incrementar las ventas online en un 25% cada año.
                    </p>
                </div>
            </div>
            <div
                class="col-md-4 mb-3 objective-item"
                in:fly={{ x: 100, duration: 500, delay: 200 }}
            >
                <div class="slate-gray rounded-3 p-4 h-100 card-anim">
                    <h5 class="FontTitle text-dark">Colaboraciones</h5>
                    <p class="FontBody text-dark">
                        Establecer 5 alianzas con artistas y creadores locales.
                    </p>
                </div>
            </div>
        </div>

        <!-- Contacto -->
        <div
            class="row purple-700 rounded-3 p-4 contact-section container m-auto"
            in:fade={{ duration: 500 }}
        >
            <div class="col-md-8" in:fly={{ x: -200, duration: 600 }}>
                <h2 class="FontTitle text-light">¿Tienes preguntas?</h2>
                <p class="FontBody text-light">
                    Visita nuestra
                    <a href="/contacto" class="contact-link text-light">
                        página de contacto
                    </a>
                    para enviarnos tus dudas, sugerencias o colaboraciones.
                </p>
            </div>
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
    /* Paleta Morada Business */
    .purple-900 {
        background-color: #2e0854;
    }
    .purple-700 {
        background-color: #5a2e8a;
    }
    .purple-500 {
        background-color: #8f52c1;
    }
    .lavender-300 {
        background-color: #cba3e0;
    }
    .slate-gray {
        background-color: #f4f2f8;
    }
    .accent-gold {
        background-color: #f8c555;
    }
    .text-dark {
        color: #1f1a2e;
    }
    .text-light {
        color: #ffffff;
    }

    .intro-img {
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
    .card-anim {
        transition:
            transform 0.3s,
            box-shadow 0.3s;
    }
    .card-anim:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .contact-link {
        font-weight: bold;
        position: relative;
        text-decoration: none;
    }
    .contact-link::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        background: #ffffff;
        bottom: -4px;
        left: 0;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s;
    }
    .contact-link:hover::after {
        transform: scaleX(1);
    }
</style>
