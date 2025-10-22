<script>
    import { cart } from '../stores/cart';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { fade, scale } from 'svelte/transition';
    
    let showButton = false;
    let itemCount = 0;
    
    // Suscribirse al carrito para actualizar el contador
    const unsubscribe = cart.subscribe(items => {
        itemCount = items.reduce((total, item) => total + item.quantity, 0);
        showButton = itemCount > 0;
    });
    
    onMount(() => {
        return () => {
            unsubscribe();
        };
    });
    
    onDestroy(() => {
        unsubscribe();
    });
    
    function goToCart() {
        goto('/carrito');
    }
</script>

{#if showButton}
    <button 
        class="cart-button"
        on:click={goToCart}
        aria-label="Ver carrito ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})"
        in:scale={{ duration: 300 }}
        out:fade={{ duration: 200 }}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {#if itemCount > 0}
            <span class="cart-count" in:scale={{ duration: 200 }}>{itemCount}</span>
        {/if}
    </button>
{/if}

<style>
    .cart-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #0d6efd;
        color: white;
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .cart-button:hover {
        background-color: #0b5ed7;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    .cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #dc3545;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
        animation: pulse 0.5s ease-in-out;
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }
    
    @media (max-width: 768px) {
        .cart-button {
            bottom: 1rem;
            right: 1rem;
            width: 50px;
            height: 50px;
        }
        
        .cart-button svg {
            width: 20px;
            height: 20px;
        }
        
        .cart-count {
            width: 20px;
            height: 20px;
            font-size: 0.65rem;
        }
    }
</style>
