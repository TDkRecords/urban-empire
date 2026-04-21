<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        isAuthenticated,
        getCurrentUser,
        logout as authLogout,
    } from "$lib/utils/auth";

    let adminUser = {};
    let isLoggedIn = false;

    onMount(async () => {
        if (!(await isAuthenticated())) {
            goto("/admin-panel-2025/login");
            return;
        }

        adminUser = await getCurrentUser();
        isLoggedIn = true;
    });

    async function logout() {
        authLogout();
        await goto("/admin-panel-2025/login");
        window.location.reload();
    }
</script>

{#if isLoggedIn}
    <div class="navbar-admin">
        <div class="container-fluid py-4">
            <div
                class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
            >
                <div>
                    <h1 class="h3 mb-0 fw-bold">
                        <i class="bi bi-grid-fill me-2 text-primary"></i>
                        Panel de Control
                    </h1>
                    <p class="text-muted mb-0 mt-1">
                        Bienvenido de vuelta, {adminUser?.usuario}
                    </p>
                </div>

                <div class="d-flex gap-2 mt-3 mt-md-0">
                    <a
                        href="/admin-panel-2025/productos"
                        class="btn btn-outline-primary"
                    >
                        <i class="bi bi-box-seam me-1"></i> Productos
                    </a>

                    <a
                        href="/admin-panel-2025/proveedores"
                        class="btn btn-outline-success"
                    >
                        <i class="bi bi-people me-1"></i> Proveedores
                    </a>

                    <a
                        href="/admin-panel-2025/etiquetas"
                        class="btn btn-outline-secondary"
                    >
                        <i class="bi bi-tags me-1"></i> Etiquetas
                    </a>

                    <button
                        class="btn btn-outline-danger btn-sm"
                        on:click={logout}
                    >
                        <i class="bi bi-box-arrow-right me-1"></i>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
<div>
    <slot />
</div>

<style>
    .navbar-admin {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
</style>
