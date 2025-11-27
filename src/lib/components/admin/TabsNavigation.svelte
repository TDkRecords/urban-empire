<script>
    export let activeTab;
    export let productos = [];
    export let proveedores = [];
</script>

<ul class="nav nav-tabs mb-4" id="dashboardTabs" role="tablist">
    <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            class:active={activeTab === "productos"}
            on:click={() => (activeTab = "productos")}
            role="tab"
            aria-selected={activeTab === "productos"}
        >
            📦 Productos ({productos.length})
        </button>
    </li>
    <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            class:active={activeTab === "proveedores"}
            on:click={() => (activeTab = "proveedores")}
            role="tab"
            aria-selected={activeTab === "proveedores"}
        >
            🏢 Proveedores ({proveedores.length})
        </button>
    </li>
</ul>
