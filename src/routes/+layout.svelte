<script>
    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte";
    import CartButton from "$lib/components/CartButton.svelte";
</script>

<Navbar />

<slot />

<Footer />
<CartButton />

<style>
    :global(body) {
        padding-bottom: 80px; /* Asegurar que el contenido no quede oculto detrás del botón */
    }
</style>
