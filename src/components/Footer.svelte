<script>
    import { fly, fade, scale } from "svelte/transition";
    let email = "";
    const socialLinks = [
        { name: "Facebook", icon: "fab fa-facebook-f", url: "/" },
        { name: "Twitter", icon: "fab fa-twitter", url: "/" },
        { name: "Instagram", icon: "fab fa-instagram", url: "/" },
        { name: "LinkedIn", icon: "fab fa-linkedin-in", url: "/" },
    ];
    const submitNewsletter = () => {
        alert(`Gracias por suscribirte, ${email}!`);
        email = "";
    };
</script>

<footer
    class="footer bg-dark text-white py-5 mt-5"
    in:fly={{ y: 50, duration: 500 }}
>
    <div class="container">
        <div class="row justify-content-between">
            <!-- Newsletter -->
            <div class="col-md-4 mb-4" in:fade={{ delay: 200, duration: 600 }}>
                <h5 class="FontTitle mb-3">Suscríbete a nuestro boletín</h5>
                <form
                    on:submit|preventDefault={submitNewsletter}
                    class="d-flex newsletter-form"
                >
                    <input
                        type="email"
                        bind:value={email}
                        class="form-control me-2 newsletter-input"
                        placeholder="Introduce tu correo"
                        required
                    />
                    <button
                        class="btn btn-info btn-newsletter FontBody"
                        type="submit"
                    >
                        Suscribirse
                    </button>
                </form>
            </div>

            <!-- Social links -->
            <div
                class="col-md-3 mb-4 text-center"
                in:fade={{ delay: 400, duration: 600 }}
            >
                <h5 class="FontTitle mb-3">Síguenos</h5>
                <div class="d-flex justify-content-center social-icons">
                    {#each socialLinks as link, i}
                        <a
                            href={link.url}
                            alt={link.name}
                            class="text-white mx-2 social-link"
                            target="_blank"
                            rel="noopener"
                            in:scale={{ duration: 300, delay: 100 * i }}
                        >
                            <i class={link.icon}></i>
                            <span class="visually-hidden">{link.name}</span>
                        </a>
                    {/each}
                </div>
            </div>

            <!-- Brand Info -->
            <div
                class="col-md-4 text-center text-md-end"
                in:fade={{ delay: 600, duration: 600 }}
            >
                <h5 class="FontTitle mb-3">Urban Empire</h5>
                <p class="FontBody mb-2">
                    Creando ciudades que prosperan en el siglo XXI. Únete a
                    nuestra misión de construir un futuro urbano más brillante.
                </p>
                <p class="FontBody small mb-0">
                    &copy; {new Date().getFullYear()} Urban Empire. Todos los derechos
                    reservados.
                </p>
            </div>
        </div>
    </div>
</footer>

<style>
    .newsletter-form {
        transition: box-shadow 0.3s;
    }
    .newsletter-input {
        border: 2px solid #00ccff;
        transition: box-shadow 0.3s;
    }
    .newsletter-input:focus {
        box-shadow: 0 0 8px rgba(0, 204, 255, 0.6);
        outline: none;
    }
    .btn-newsletter {
        transition: transform 0.2s;
    }
    .btn-newsletter:hover {
        transform: scale(1.05);
    }
    .social-link {
        font-size: 1.25rem;
        transition:
            color 0.3s,
            transform 0.3s;
    }
    .social-link:hover {
        color: #00ccff;
        transform: translateY(-3px);
    }
    footer {
        border-top: 2px solid #00ccff;
    }
</style>
