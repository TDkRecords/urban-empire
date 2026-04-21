<script>
    export let searchTerm = "";
    export let selectedTag = "all";
    export let tags = [];
</script>

<div class="card shadow-sm mb-4">
    <div class="card-body">
        <div class="row g-3">
            <div class="col-12 col-md-8">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="fas fa-search text-muted"></i>
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
                <select class="form-select" bind:value={selectedTag}>
                    <option value="all">Todas las etiquetas</option>
                    <option value="sin-etiqueta">Sin etiquetas</option>

                    {#each tags as tag}
                        <option value={tag.nombre}>
                            {tag.nombre}
                        </option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
</div>