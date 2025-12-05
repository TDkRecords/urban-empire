<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { login, isAuthenticated } from "$lib/utils/auth";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;
    let rememberMe = false;

    // Redirigir si ya está autenticado
    onMount(() => {
        if (browser && isAuthenticated()) {
            window.location.href = "/admin-panel-2025/";
        }
    });

    async function handleLogin(event) {
        event.preventDefault();
        if (!browser || loading) return;

        // Validación básica
        if (!email) {
            error = "Por favor ingrese su correo electrónico";
            return;
        }

        if (!password) {
            error = "Por favor ingrese su contraseña";
            return;
        }

        loading = true;
        error = "";

        try {
            const { success, error: loginError } = await login(email, password);
            if (success) {
                window.location.href = "/admin-panel-2025/";
            } else {
                error =
                    loginError ||
                    "Error al iniciar sesión. Por favor, intente nuevamente.";
            }
        } catch (err) {
            console.error("Login error:", err);
            error =
                "Ocurrió un error inesperado. Por favor, intente nuevamente.";
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Iniciar Sesión - Panel Administrativo</title>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
    />
</svelte:head>

<div class="min-vh-100 d-flex align-items-center bg-gradient-primary">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-5">
                <!-- Logo y Título -->
                <div class="text-center mb-5">
                    <div class="mb-3">
                        <i class="bi bi-shop fs-1 text-white"></i>
                    </div>
                    <h1 class="h3 text-white mb-0">Urban Empire</h1>
                    <p class="h5 text-white mb-4">Panel Administrativo</p>
                    <p class="text-white-50">
                        Ingrese sus credenciales para continuar
                    </p>
                </div>

                <!-- Tarjeta de Inicio de Sesión -->
                <div class="card border-0 shadow-lg">
                    <div class="card-body p-5">
                        <h2 class="h4 text-center mb-4">Iniciar Sesión</h2>

                        {#if error}
                            <div
                                class="alert alert-danger d-flex align-items-center"
                                role="alert"
                            >
                                <i class="bi bi-exclamation-triangle-fill me-2"
                                ></i>
                                <div>{error}</div>
                            </div>
                        {/if}

                        <form on:submit={handleLogin}>
                            <!-- Campo de Correo -->
                            <div class="mb-3">
                                <label for="email" class="form-label"
                                    >Correo Electrónico</label
                                >
                                <div class="input-group">
                                    <span class="input-group-text">
                                        <i class="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        class="form-control form-control-lg"
                                        bind:value={email}
                                        placeholder="tu@correo.com"
                                        required
                                        autocomplete="username"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <!-- Campo de Contraseña -->
                            <div class="mb-4">
                                <label for="password" class="form-label"
                                    >Contraseña</label
                                >
                                <div class="input-group">
                                    <span class="input-group-text">
                                        <i class="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        id="password"
                                        class="form-control form-control-lg"
                                        bind:value={password}
                                        placeholder="••••••••"
                                        required
                                        autocomplete="current-password"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <!-- Recordar sesión -->
                            <div class="mb-4 form-check">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    class="form-check-input"
                                    bind:checked={rememberMe}
                                    disabled={loading}
                                />
                                <label
                                    class="form-check-label"
                                    for="rememberMe"
                                >
                                    Recordar mi sesión
                                </label>
                            </div>

                            <!-- Botón de Inicio de Sesión -->
                            <div class="d-grid gap-2 mt-4">
                                <button
                                    type="submit"
                                    class="btn btn-primary btn-lg"
                                    disabled={loading}
                                >
                                    {#if loading}
                                        <span
                                            class="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Iniciando sesión...
                                    {:else}
                                        <i class="bi bi-box-arrow-in-right me-2"
                                        ></i>Iniciar Sesión
                                    {/if}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Copyright -->
                <div class="text-center mt-4">
                    <p class="text-white-50 small mb-0">
                        &copy; {new Date().getFullYear()} Urban Empire. Todos los
                        derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(html, body) {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .bg-gradient-primary {
        background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
    }

    .card {
        border-radius: 1rem;
        overflow: hidden;
    }

    .form-control,
    .form-select {
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
    }

    .btn {
        border-radius: 0.5rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .btn-primary {
        background-color: #4e73df;
        border-color: #4e73df;
    }

    .btn-primary:hover {
        background-color: #2e59d9;
        border-color: #2653d4;
    }
</style>
