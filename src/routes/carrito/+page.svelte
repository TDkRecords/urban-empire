<script>
    import { cart } from '$lib/stores/cart';
    import { fade, fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import { auth } from '$lib/assets/js/firebase';
    import { user, authLoading } from '$lib/stores/authStore';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { onAuthStateChanged } from 'firebase/auth';
    
    let cartItems = [];
    let loading = true;
    let total = 0;
    
    // Suscribirse a los cambios en el carrito
    const unsubscribe = cart.subscribe(items => {
        cartItems = items;
        calculateTotal();
    });
    
    let authUnsubscribe;
    
    onMount(() => {
        if (!browser) return;
        
        // Escuchar cambios en la autenticación directamente con Firebase
        authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                // No redirigir automáticamente, solo mostrar mensaje
                loading = false;
            } else {
                loading = false;
            }
        });
        
        return () => {
            if (authUnsubscribe) authUnsubscribe();
            unsubscribe();
        };
    });
    
    function calculateTotal() {
        total = cartItems.reduce((sum, item) => {
            // Usar precio numérico si está disponible, de lo contrario convertir de string
            const price = typeof item.precio === 'number' 
                ? item.precio 
                : parseFloat((item.price || '0').replace(/[^0-9.-]+/g, ''));
            return sum + (price * item.quantity);
        }, 0);
    }
    
    function updateQuantity(item, newQuantity) {
        if (newQuantity < 1) return;
        if (item.stock && newQuantity > item.stock) {
            alert(`Solo hay ${item.stock} unidades disponibles`);
            return;
        }
        
        cart.updateQuantity(item.id, newQuantity);
    }
    
    function removeItem(productId) {
        cart.removeFromCart(productId);
    }
    
    function formatPrice(price) {
        // Formatear el precio con separadores de miles
        return `$${parseFloat(price).toLocaleString('es-CO')}`;
    }
</script>

<main class="container my-5">
    <div class="row">
        <div class="col-12">
            <h1 class="mb-4 FontTitle">Carrito de Compras</h1>
            
            {#if loading}
                <div class="text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando carrito...</span>
                    </div>
                    <p class="mt-2">Cargando tu carrito...</p>
                </div>
            {:else if !auth.currentUser}
                <div class="text-center py-5" in:fade>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-person-x mb-3 text-muted" viewBox="0 0 16 16">
                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.811-.934C8.878 8.837 8.475 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z"/>
                    </svg>
                    <h3 class="FontTitle">Acceso requerido</h3>
                    <p class="text-muted">Necesitas iniciar sesión para ver tu carrito</p>
                    <button on:click={() => goto('/')} class="btn btn-primary mt-3">
                        Volver al inicio
                    </button>
                </div>
            {:else if cartItems.length === 0}
                <div class="text-center py-5" in:fade>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-cart-x mb-3 text-muted" viewBox="0 0 16 16">
                        <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <h3 class="FontTitle">Tu carrito está vacío</h3>
                    <p class="text-muted">Aún no has añadido productos a tu carrito</p>
                    <a href="/productos" class="btn btn-primary mt-3">Ver productos</a>
                </div>
            {:else}
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each cartItems as item (item.id)}
                                <tr in:fly={{ y: 20, duration: 300 }}>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img 
                                                src={item.imageUrl || item.imagen || 'https://via.placeholder.com/80?text=Sin+imagen'} 
                                                alt={item.title || item.nombre || 'Producto'} 
                                                style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"
                                                class="me-3"
                                                on:error={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80?text=Sin+imagen';
                                                }}
                                            >
                                            <div>
                                                <h6 class="mb-0 FontTitle">{item.title || item.nombre}</h6>
                                                {#if item.categoria}
                                                    <small class="text-muted">{item.categoria}</small>
                                                {/if}
                                                <small class="text-muted d-block">Stock: {item.stock || 'N/A'}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        {formatPrice(typeof item.precio === 'number' ? item.precio : (item.price || 0))}
                                    </td>
                                    <td class="align-middle">
                                        <div class="input-group" style="width: 120px;">
                                            <button 
                                                class="btn btn-outline-secondary" 
                                                type="button"
                                                on:click={() => updateQuantity(item, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input 
                                                type="text" 
                                                class="form-control text-center" 
                                                value={item.quantity}
                                                readonly
                                            >
                                            <button 
                                                class="btn btn-outline-secondary" 
                                                type="button"
                                                on:click={() => updateQuantity(item, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        {#if typeof item.precio === 'number'}
                                            {formatPrice(item.precio * item.quantity)}
                                        {:else}
                                            {formatPrice(parseFloat((item.price || '0').replace(/[^0-9.-]+/g, '')) * item.quantity)}
                                        {/if}
                                    </td>
                                    <td class="align-middle">
                                        <button 
                                            class="btn btn-link text-danger"
                                            on:click={() => removeItem(item.id)}
                                            aria-label="Eliminar producto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                <td colspan="2"><strong>{formatPrice(total)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div class="d-flex justify-content-between mt-4">
                    <a href="/productos" class="btn btn-outline-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                        Seguir comprando
                    </a>
                    <div>
                        <button class="btn btn-outline-danger me-2" on:click={() => cart.clearCart()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash me-2" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                            Vaciar carrito
                        </button>
                        <a href="/checkout" class="btn btn-primary">
                            Proceder al pago
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right ms-2" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                            </svg>
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    .table th {
        font-weight: 600;
        border-top: none;
        border-bottom: 2px solid #dee2e6;
    }
    
    .table td {
        vertical-align: middle;
    }
    
    .btn-outline-secondary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .input-group {
        margin: 0 auto;
    }
    
    .btn-link {
        text-decoration: none;
    }
    
    .btn-link:hover {
        text-decoration: none;
    }
    
    @media (max-width: 768px) {
        .table-responsive {
            border: 0;
        }
        
        .table thead {
            display: none;
        }
        
        .table tbody tr {
            display: block;
            margin-bottom: 1rem;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
        }
        
        .table tbody td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            border-bottom: 1px solid #dee2e6;
        }
        
        .table tbody td::before {
            content: attr(data-label);
            font-weight: 600;
            margin-right: 1rem;
        }
        
        .table tbody td:last-child {
            border-bottom: none;
        }
        
        .d-flex.justify-content-between {
            flex-direction: column;
            gap: 1rem;
        }
        
        .d-flex.justify-content-between .btn {
            width: 100%;
            margin: 0.25rem 0;
        }
    }
</style>
