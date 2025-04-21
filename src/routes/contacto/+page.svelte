<script>
    import "../../app.css";
    import AxelProfile from "$lib/assets/images/cv-profile.jpg";
    import DanielProfile from "$lib/assets/images/Image-Profile-Daniel.jpg";
    import { fade, fly, scale } from "svelte/transition";

    const onSubmitHandler = () => {
        alert("¡Mensaje enviado con éxito!");
    };
</script>

<main class="container" in:fade={{ duration: 500 }}>
    <div
        class="bg-white p-4 my-3 rounded shadow-sm"
        in:fly={{ y: 50, duration: 600 }}
    >
        <!-- Encabezado -->
        <div class="text-center mb-5" in:fade={{ delay: 200, duration: 600 }}>
            <h1
                class="FontTitle text-uppercase mb-3 header-title"
                in:fly={{ x: -100, duration: 500 }}
            >
                Contacta al Equipo Urban Empire
            </h1>
            <p
                class="FontBody lead mb-2"
                in:fly={{ x: 100, duration: 500, delay: 100 }}
            >
                ¿Necesitas ayuda personalizada? Escríbenos o contacta
                directamente a nuestro equipo especializado
            </p>
            <a
                href="mailto:contacto@urbanempire.com"
                class="FontBody text-decoration-none text-dark fw-bold email-link"
                in:scale={{ duration: 500 }}>contacto@urbanempire.com</a
            >
        </div>

        <!-- Equipo -->
        <div class="row row-cols-1 row-cols-md-3 g-4 mb-5">
            <!-- Tarjeta miembro -->
            {#each [{ src: AxelProfile, name: "Alex", role: "Desarrollador Full Stack - Encargado de la plataforma web y experiencia digital. Especialista en e-commerce." }, { src: DanielProfile, name: "Daniel", role: "Diseñador Principal - Creador de nuestras colecciones y supervisor de producción. Experto en tejidos técnicos." }, { src: "/src/lib/assets/images/user.png", name: "Angela", role: "Directora Financiera - Gestión de pedidos y logística. Especialista en comercio internacional y aduanas." }] as member, i}
                <div
                    class="col"
                    in:fly={{ y: 50, duration: 600, delay: 200 * i }}
                >
                    <div class="card h-100 border-0 bg-light hover-card">
                        <img
                            src={member.src}
                            alt={member.name}
                            class="card-img-top rounded-circle w-75 mx-auto mt-4 img_aspect"
                            in:scale={{ duration: 500, delay: 200 * i }}
                        />
                        <div
                            class="card-body text-center"
                            in:fade={{ duration: 500, delay: 300 * i }}
                        >
                            <h3 class="FontTitle mb-3">{member.name}</h3>
                            <p class="FontBody small mb-0 px-3">
                                {member.role}
                            </p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Formulario -->
        <form
            method="post"
            on:submit|preventDefault={onSubmitHandler}
            class="contact-form mx-auto"
            in:fly={{ y: 50, duration: 600, delay: 800 }}
        >
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <input
                        type="text"
                        placeholder="Asunto"
                        class="FontBody form-control py-2 border-dark input-animated"
                        required
                        in:fade={{ duration: 400, delay: 900 }}
                    />
                </div>
                <div class="col-md-6">
                    <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        class="FontBody form-control py-2 border-dark input-animated"
                        required
                        in:fade={{ duration: 400, delay: 1000 }}
                    />
                </div>
                <div class="col-12">
                    <textarea
                        class="FontBody form-control py-2 border-dark input-animated"
                        rows="5"
                        placeholder="Describe tu consulta..."
                        required
                        in:fade={{ duration: 400, delay: 1100 }}
                    ></textarea>
                </div>
            </div>
            <button
                type="submit"
                class="FontTitle btn btn-dark rounded-pill px-4 py-2 d-flex align-items-center mx-auto send-btn"
                in:scale={{ duration: 500, delay: 1200 }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-send me-2"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"
                    />
                </svg>
                Enviar Mensaje
            </button>
        </form>
    </div>
</main>

<style>
    .hover-card {
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
    }
    .hover-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    .contact-form {
        max-width: 800px;
    }
    .border-dark {
        border: 2px solid #333 !important;
    }
    .img_aspect {
        aspect-ratio: 1/1;
    }

    /* Animación de botón enviar */
    .send-btn {
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }
    .send-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    /* Inputs animated focus */
    .input-animated {
        transition:
            border-color 0.3s,
            box-shadow 0.3s;
    }
    .input-animated:focus {
        border-color: #00ccff !important;
        box-shadow: 0 0 5px rgba(0, 204, 255, 0.5);
        outline: none;
    }

    /* Email link pulse */
    .email-link {
        display: inline-block;
        position: relative;
        color: #333;
        text-decoration: none;
        font-size: 1.1rem;
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
</style>
