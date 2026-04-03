<script>
    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte";
    import CartButton from "$lib/components/CartButton.svelte";
    import "alertifyjs/build/css/alertify.css";
    import "alertifyjs/build/css/themes/bootstrap.css";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    onMount(() => {
        if (browser) {
            import("alertifyjs").then((alertify) => {
                window.alertify = alertify.default;
                window.alertify.defaults.glossary.title = "Urban Empire";
                window.alertify.defaults.theme.ok = "btn btn-primary";
                window.alertify.defaults.theme.cancel = "btn btn-secondary";
                window.alertify.defaults.theme.input = "form-control";
                window.alertify.defaults.transition = "slide";
                window.alertify.defaults.glossary.ok = "Aceptar";
                window.alertify.defaults.glossary.cancel = "Cancelar";
            });
        }
    });
</script>

<div class="app-wrapper">
    <Navbar />

    <main class="main-content">
        <slot />
    </main>

    <Footer />
    <CartButton />
</div>

<style>
    :global(html, body) {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    :global(body) {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .app-wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .main-content {
        flex: 1 0 auto;
    }

    :global(footer) {
        flex-shrink: 0;
        margin-top: auto;
    }
</style>
