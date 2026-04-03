<script>
    export let searchTerm = "";
    export let placeholder = "Buscar...";
</script>

<div class="card shadow-sm mb-4">
    <div class="card-body">
        <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search text-muted"></i>
            </span>
            <input
                type="text"
                class="form-control border-start-0"
                {placeholder}
                bind:value={searchTerm}
            />
        </div>
    </div>
</div>