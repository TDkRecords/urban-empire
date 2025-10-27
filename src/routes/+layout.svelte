<script>
    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte";
    import CartButton from "$lib/components/CartButton.svelte";
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
        padding-bottom: 80px; /* Space for cart button */
    }

    :global(footer) {
        flex-shrink: 0;
        margin-top: auto;
    }
</style>
