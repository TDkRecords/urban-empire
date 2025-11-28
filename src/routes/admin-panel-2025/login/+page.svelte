<script>
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { auth } from "$lib/assets/js/firebase";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    // Check if already logged in
    onMount(() => {
        if (!browser) return;

        const isLoggedIn =
            sessionStorage.getItem("adminLoggedIn") ||
            localStorage.getItem("adminLoggedIn");
        if (isLoggedIn === "true") {
            goto("/admin-panel-2025/dashboard", { replaceState: true });
        }
    });

    async function handleLogin() {
        if (!email || !password) {
            error = "Por favor ingrese correo y contraseña";
            return;
        }

        loading = true;
        error = "";

        try {
            // Sign in with Firebase Authentication
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );

            // Get the ID token to verify on the server if needed
            const idToken = await user.getIdToken();

            // Store authentication state
            const userData = {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                isAdmin: true, // You might want to verify this from your database
            };

            // Store in session storage
            sessionStorage.setItem("adminLoggedIn", "true");
            sessionStorage.setItem("adminUser", JSON.stringify(userData));

            // Store in local storage as fallback
            localStorage.setItem("adminLoggedIn", "true");
            localStorage.setItem("adminUser", JSON.stringify(userData));

            // Redirect to dashboard
            goto("/admin-panel-2025/dashboard", { replaceState: true });
        } catch (err) {
            console.error("Login error:", err);

            // Handle different Firebase auth errors
            switch (err.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                    error = "Correo o contraseña incorrectos";
                    break;
                case "auth/too-many-requests":
                    error = "Demasiados intentos fallidos. Intente más tarde.";
                    break;
                case "auth/user-disabled":
                    error = "Esta cuenta ha sido deshabilitada";
                    break;
                default:
                    error =
                        "Error al iniciar sesión. Por favor intente de nuevo.";
            }
        } finally {
            loading = false;
        }
    }
</script>

<div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow">
                    <div class="card-body p-4">
                        <h2 class="text-center mb-4">Iniciar Sesión</h2>

                        {#if error}
                            <div class="alert alert-danger">{error}</div>
                        {/if}

                        <form on:submit|preventDefault={handleLogin}>
                            <div class="mb-3">
                                <label for="email" class="form-label"
                                    >Correo Electrónico</label
                                >
                                <input
                                    type="email"
                                    id="email"
                                    class="form-control"
                                    bind:value={email}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div class="mb-3">
                                <label for="password" class="form-label"
                                    >Contraseña</label
                                >
                                <input
                                    type="password"
                                    id="password"
                                    class="form-control"
                                    bind:value={password}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                class="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {#if loading}
                                    <span
                                        class="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Iniciando...
                                {:else}
                                    Iniciar Sesión
                                {/if}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    body {
        background-color: #f8f9fa;
    }
    .card {
        border: none;
        border-radius: 10px;
    }
</style>
