<script>
    import Logo from "$lib/assets/images/logo.jpg";
    import { fade, fly } from "svelte/transition";
</script>

<main>
    <div class="container my-5">
        <div
            class="row bg-white rounded-3 p-4 mb-4 container m-auto"
            in:fade={{ duration: 500 }}
        >
            <div
                class="col-md-4 d-flex justify-content-center align-items-center"
                in:fly={{ x: -200, duration: 600 }}
            >
                <img
                    src={Logo}
                    alt="Logo Urban Empire"
                    class="img-fluid rounded-circle intro-img"
                />
            </div>
            <div class="col-md-8" in:fly={{ x: 200, duration: 600 }}>
                <h1 class="FontTitle intro-title">Sobre Urban Empire</h1>
                <p class="FontBody intro-text">
                    En Urban Empire, nuestra pasión es fusionar la cultura
                    urbana con diseños de vanguardia. Fundada en 2020 en Madrid,
                    somos un colectivo de creativos, diseñadores y artesanos que
                    buscan redefinir el streetwear contemporáneo.
                </p>
            </div>
        </div>

        <div class="row mb-5 missions" in:fade={{ duration: 500 }}>
            <div
                class="col-md-6 mb-4 mission-item"
                in:fly={{ y: 100, duration: 600 }}
            >
                <div class="bg-white rounded-3 p-4 h-100 card-anim">
                    <h2 class="FontTitle">Nuestra Misión</h2>
                    <p class="FontBody">
                        En Urban Empire nos esforzamos por ser mucho más que una
                        marca de ropa: queremos convertirnos en un referente
                        cultural que empodere a cada individuo a través de
                        prendas únicas. Nuestra misión es diseñar y producir
                        ropa sostenible, funcional y con un estilo
                        inconfundible, integrando tecnología textil de última
                        generación con prácticas ecológicas. Buscamos inspirar
                        confianza y originalidad, proporcionando herramientas de
                        autoexpresión para aquellos que viven y respiran la
                        energía de la ciudad.
                    </p>
                    <p class="FontBody">
                        Empleamos materiales reciclados y procesos de bajo
                        impacto ambiental, colaboramos con artesanos locales y
                        fomentamos un modelo de economía circular. Además,
                        promovemos iniciativas sociales que apoyan comunidades
                        urbanas vulnerables, destinando parte de nuestros
                        ingresos a proyectos educativos y culturales. Cada
                        prenda de Urban Empire tiene un propósito: redefinir el
                        concepto de moda urbana y dejar una huella positiva en
                        el planeta.
                    </p>
                </div>
            </div>
            <div
                class="col-md-6 mb-4 mission-item"
                in:fly={{ y: 100, duration: 600, delay: 200 }}
            >
                <div class="bg-white rounded-3 p-4 h-100 card-anim">
                    <h2 class="FontTitle">Nuestra Visión</h2>
                    <p class="FontBody">
                        Visualizamos un futuro donde el streetwear sea sinónimo
                        de innovación, sostenibilidad y autenticidad. Aspiramos
                        a transformar la industria textil, demostrando que la
                        moda urbana puede ser ética, duradera y tecnológicamente
                        avanzada. Urban Empire se ve a sí misma liderando el
                        cambio global, inspirando a otras marcas a adoptar
                        prácticas responsables y creativas.
                    </p>
                    <p class="FontBody">
                        Nos imaginamos una comunidad mundial conectada por la
                        pasión por la cultura de la calle, donde nuestros
                        diseños crucen fronteras y sirvan como lienzos de
                        historias personales. Queremos que cada prenda actúe
                        como un catalizador de conexiones reales, revoluciones
                        creativas y movimientos sociales, construyendo así un
                        legado que trascienda generaciones.
                    </p>
                </div>
            </div>
        </div>

        <div class="row mb-5" in:fade={{ duration: 500 }}>
            <div class="col-12 text-center mb-4">
                <h2 class="FontTitle text-light">Nuestros Valores</h2>
            </div>
            <div
                class="col-md-4 mb-3 value-item"
                in:fly={{ x: -100, duration: 500 }}
            >
                <div class="value-card">
                    <h5 class="FontTitle">Sostenibilidad</h5>
                    <p class="FontBody">
                        Uso de materiales ecológicos y procesos de producción
                        responsables.
                    </p>
                </div>
            </div>
            <div
                class="col-md-4 mb-3 value-item"
                in:fly={{ y: 100, duration: 500, delay: 100 }}
            >
                <div class="value-card">
                    <h5 class="FontTitle">Creatividad</h5>
                    <p class="FontBody">
                        Diseños únicos que rompen moldes y expresan tu
                        identidad.
                    </p>
                </div>
            </div>
            <div
                class="col-md-4 mb-3 value-item"
                in:fly={{ x: 100, duration: 500, delay: 200 }}
            >
                <div class="value-card">
                    <h5 class="FontTitle">Comunidad</h5>
                    <p class="FontBody">
                        Fomentamos conexiones auténticas con nuestros clientes y
                        colaboradores.
                    </p>
                </div>
            </div>
        </div>

        <div
            class="row bg-white rounded-3 p-4 contact-section container m-auto"
            in:fade={{ duration: 500 }}
        >
            <div class="col-md-8" in:fly={{ x: -200, duration: 600 }}>
                <h2 class="FontTitle">¿Tienes preguntas?</h2>
                <p class="FontBody">
                    Visita nuestra
                    <a href="/contacto" class="contact-link">
                        página de contacto
                    </a>
                    para enviarnos tus dudas, sugerencias o colaboraciones.
                </p>
            </div>
        </div>
    </div>
</main>

<style>
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
    .value-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        transition: transform 105ms;
    }
    .value-card:hover {
        transform: scale(1.05);
    }
    .contact-link {
        color: #000;
        font-weight: bold;
        position: relative;
        text-decoration: none;
    }
    .contact-link::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        background: #000;
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
