<script>
    import "../app.css";
    import { user, authLoading } from '$lib/stores/authStore.js';
    import { auth, googleProvider } from '$lib/assets/js/firebase.js';
    import { signInWithPopup, signOut } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let showDropdown = false;

    async function handleGoogleLogin() {
        try {
            await signInWithPopup(auth, googleProvider);
            goto('/perfil');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión con Google');
        }
    }

    async function handleLogout() {
        try {
            await signOut(auth);
            showDropdown = false;
            goto('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    function toggleDropdown() {
        showDropdown = !showDropdown;
    }

    // Cerrar dropdown al hacer click fuera
    onMount(() => {
        function handleClickOutside(event) {
            if (showDropdown && !event.target.closest('.user-dropdown')) {
                showDropdown = false;
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });
</script>

<nav class="navbar navbar-expand-lg purple-700 sticky-top">
    <div class="container-fluid">
        <a class="navbar-brand text-light fw-bold" href="/"> URBAN EMPIRE </a>
        <button
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link text-light" aria-current="page" href="/">
                        Inicio <i class="fa-solid fa-house"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-light" href="/productos">
                        Productos <i class="fa-solid fa-bag-shopping"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-light" href="/about">
                        Acerca de <i class="fa-solid fa-circle-info"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-light" href="/contacto">
                        Contacto <i class="fa-solid fa-user-tie"></i>
                    </a>
                </li>
                
                {#if !$authLoading}
                    {#if $user}
                        <li class="nav-item user-dropdown">
                            <button class="nav-link text-light btn-user" on:click={toggleDropdown}>
                                <img src={$user.photoURL} alt="{$user.displayName}" class="user-avatar" />
                                {$user.displayName?.split(' ')[0] || 'Usuario'}
                                <i class="fa-solid fa-chevron-down ms-1"></i>
                            </button>
                            {#if showDropdown}
                                <div class="dropdown-menu-custom">
                                    <a href="/perfil" class="dropdown-item-custom">
                                        <i class="fa-solid fa-user"></i> Mi Perfil
                                    </a>
                                    <button on:click={handleLogout} class="dropdown-item-custom logout">
                                        <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
                                    </button>
                                </div>
                            {/if}
                        </li>
                    {:else}
                        <li class="nav-item">
                            <button class="btn-login" on:click={handleGoogleLogin}>
                                <i class="fa-brands fa-google"></i> Iniciar Sesión
                            </button>
                        </li>
                    {/if}
                {/if}
            </ul>
        </div>
    </div>
</nav>

<style>
    .navbar {
        padding: 1rem 2rem;
        box-shadow: 0 2px 15px rgba(46, 8, 84, 0.08);
    }

    .navbar-brand {
        font-size: clamp(1.4rem, 1vw, 3rem);
        letter-spacing: -0.5px;
    }

    .nav-link {
        position: relative;
        margin: 0 1rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .nav-link i {
        color: #ffffff;
        margin-left: 0.3rem;
        transition: inherit;
    }

    .nav-link:hover {
        color: #f8c555 !important;
    }

    .nav-link:hover i {
        color: #f8c555;
    }

    .navbar-toggler-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%231F1A2E' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }

    .navbar-toggler:focus {
        box-shadow: 0 0 0 2px rgba(248, 197, 85, 0.5);
    }

    /* Estilos de autenticación */
    .btn-login {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-login:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-user {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
    }

    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #f8c555;
    }

    .user-dropdown {
        position: relative;
    }

    .dropdown-menu-custom {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        margin-top: 0.5rem;
        min-width: 200px;
        z-index: 1000;
        overflow: hidden;
    }

    .dropdown-item-custom {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.25rem;
        color: #333;
        text-decoration: none;
        transition: background 0.2s;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-size: 0.95rem;
    }

    .dropdown-item-custom:hover {
        background: #f8f9fa;
    }

    .dropdown-item-custom.logout {
        color: #dc3545;
        border-top: 1px solid #e9ecef;
    }

    .dropdown-item-custom.logout:hover {
        background: #fff5f5;
    }

    @media (max-width: 991px) {
        .btn-login {
            margin: 0.5rem 1rem;
        }

        .user-dropdown {
            margin: 0.5rem 1rem;
        }

        .dropdown-menu-custom {
            position: static;
            box-shadow: none;
            border: 1px solid #e9ecef;
            margin-top: 0.5rem;
        }
    }
</style>
