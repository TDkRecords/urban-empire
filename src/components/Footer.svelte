<script>
    import { fly, fade, scale } from "svelte/transition";
    let email = "";
    const socialLinks = [
        {
            name: "Facebook",
            icon: "fab fa-facebook-f",
            url: "https://www.facebook.com/profile.php?id=61572705947719",
        },
        {
            name: "Twitter",
            icon: "fab fa-twitter",
            url: "https://x.com/_axeljosh_",
        },
        {
            name: "Instagram",
            icon: "fab fa-instagram",
            url: "https://www.instagram.com/_axeljosh_/",
        },
        {
            name: "LinkedIn",
            icon: "fab fa-whatsapp",
            url: "https://wa.me/573159603020",
        },
    ];
    const submitNewsletter = () => {
        alert(`Gracias por suscribirte, ${email}!`);
        email = "";
    };
</script>

<footer
    class="footer purple-900 text-light py-5 border-0"
    in:fly={{ y: 50, duration: 500 }}
>
    <div class="container">
        <div class="row justify-content-between">
            <!-- Newsletter -->
            <div class="col-md-4 mb-4" in:fade={{ delay: 200, duration: 600 }}>
                <h5 class="FontTitle mb-3 text-light">
                    Suscríbete a nuestro boletín
                </h5>
                <form
                    on:submit|preventDefault={submitNewsletter}
                    class="d-flex newsletter-form"
                    action="https://formsubmit.co/urbanempire.colombia@gmail.com"
                    method="POST"
                >
                    <input
                        type="email"
                        name="email"
                        bind:value={email}
                        class="form-control me-2 newsletter-input lavender-300 text-light"
                        placeholder="Introduce tu correo"
                        required
                    />
                    <button
                        class="btn purple-500 text-light FontBody"
                        type="submit"
                    >
                        Suscribirse
                    </button>

                    <input
                        type="hidden"
                        name="_next"
                        value="https://urbanempire.vercel.app/"
                    />
                </form>
            </div>

            <!-- Social links -->
            <div
                class="col-md-3 mb-4 text-center"
                in:fade={{ delay: 400, duration: 600 }}
            >
                <h5 class="FontTitle mb-3 text-light">Síguenos</h5>
                <div class="d-flex justify-content-center social-icons">
                    {#each socialLinks as link, i}
                        <a
                            href={link.url}
                            alt={link.name}
                            class="text-light mx-2 social-link"
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
                <h5 class="FontTitle mb-3 text-light">Urban Empire</h5>
                <p class="FontBody mb-2">
                    Creando modas que prosperan en el siglo XXI.
                </p>
                <p class="FontBody small mb-0">
                    &copy; {new Date().getFullYear()} Todos los derechos reservados.
                </p>
            </div>
        </div>
    </div>
</footer>

<style>
    .btn {
        transition: all 0.3s;
        border: 2px solid #8f52c1; /* purple-500 */
    }
    .btn:hover {
        background-color: #f8c555; /* accent-gold */
        border-color: #f8c555;
        color: #2e0854 !important; /* purple-900 */
    }
    .social-link {
        font-size: 1.25rem;
        transition: color 0.3s;
        text-decoration: none !important;
    }
    .social-link:hover {
        color: #f8c555 !important; /* accent-gold */
    }
    footer {
        border-top: 2px solid #8f52c1; /* purple-500 */
    }
</style>
