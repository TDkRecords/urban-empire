<script>
    export let searchTerm = "";
    export let selectedCategory = "all";
    export let categories = [];
</script>

<div class="card shadow-sm mb-4">
    <div class="card-body">
        <div class="row g-3">
            <div class="col-12 col-md-8">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search text-muted"></i>
                    </span>
                    <input
                        type="text"
                        class="form-control border-start-0"
                        placeholder="Buscar por nombre o descripción..."
                        bind:value={searchTerm}
                    />
                </div>
            </div>
            <div class="col-12 col-md-4">
                <select class="form-select" bind:value={selectedCategory}>
                    {#each categories as category}
                        <option
                            value={category === "Todas"
                                ? "all"
                                : category === "Sin categoría"
                                  ? "sin-categoria"
                                  : category}
                        >
                            {category}
                        </option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
</div>