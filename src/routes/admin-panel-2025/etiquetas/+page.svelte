<script>
    import { serverTimestamp } from "firebase/firestore";
    import { fade } from "svelte/transition";
    import {
        success as notifySuccess,
        error as notifyError,
        confirm as notifyConfirm,
    } from "$lib/utils/notify";

    // Servicios
    import {
        createTag,
        updateTag,
        deleteTag,
        tags as tagsStore,
    } from "$lib/services/tagService";

    // Componentes
    import TagFormModal from "./modules/TagFormModal.svelte";
    import TagTable from "./modules/TagTable.svelte";

    // Estado
    let loading = false;
    let error = null;
    let searchTerm = "";

    // Modal y formulario
    let showModal = false;
    let editingTag = null;
    let formSubmitting = false;
    let formData = {
        nombre: "",
        descripcion: "",
        color: "#007bff",
    };

    // Etiquetas filtradas
    $: tagsFiltradas = $tagsStore.filter((t) => {
        const matchesSearch =
            t.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Abrir modal para crear
    function openCreateModal() {
        editingTag = null;
        formData = {
            nombre: "",
            descripcion: "",
            color: "#007bff",
        };
        showModal = true;
    }

    // Abrir modal para editar
    function openEditModal(tag) {
        editingTag = tag;
        formData = {
            nombre: tag.nombre || "",
            descripcion: tag.descripcion || "",
            color: tag.color || "#007bff",
        };
        showModal = true;
    }

    // Cerrar modal
    function closeModal() {
        showModal = false;
        editingTag = null;
        formData = {
            nombre: "",
            descripcion: "",
            color: "#007bff",
        };
    }

    // Guardar etiqueta
    async function handleSubmit() {
        if (!formData.nombre.trim()) {
            notifyError("El nombre de la etiqueta es obligatorio");
            return;
        }

        formSubmitting = true;
        error = null;

        try {
            const tagData = {
                ...formData,
                fechaActualizacion: serverTimestamp(),
            };

            if (editingTag) {
                // Actualizar etiqueta existente
                await updateTag(editingTag.id, tagData);
                notifySuccess("Etiqueta actualizada exitosamente");
            } else {
                // Crear nueva etiqueta
                tagData.fechaCreacion = serverTimestamp();
                await createTag(tagData);
                notifySuccess("Etiqueta creada exitosamente");
            }

            closeModal();
        } catch (err) {
            console.error("Error al guardar etiqueta:", err);
            error = "Error al guardar la etiqueta";
            notifyError("Error al guardar la etiqueta. Intente nuevamente.");
        } finally {
            formSubmitting = false;
        }
    }

    // Eliminar etiqueta
    async function handleDelete(tag) {
        notifyConfirm(
            `¿Está seguro de eliminar la etiqueta "${tag.nombre}"?`,
            async () => {
                try {
                    await deleteTag(tag.id);
                    notifySuccess("Etiqueta eliminada exitosamente");
                } catch (err) {
                    console.error("Error al eliminar etiqueta:", err);
                    notifyError("Error al eliminar la etiqueta");
                }
            },
            () => {
                // Cancelado por el usuario
            },
        );
    }
</script>

<svelte:head>
    <title>Gestión de Etiquetas - Panel Admin</title>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
    />
</svelte:head>

<div class="container py-4" in:fade={{ duration: 300 }}>
    <!-- Header -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h1 class="h3 mb-1 text-dark">
                        <i class="fas fa-tags me-2 text-primary"></i>
                        Gestión de Etiquetas
                    </h1>
                    <p class="text-muted mb-0">
                        Administra las etiquetas para clasificar tus productos
                    </p>
                </div>
                <button
                    class="btn btn-primary d-flex align-items-center"
                    on:click={openCreateModal}
                >
                    <i class="fas fa-plus me-2"></i>
                    Nueva Etiqueta
                </button>
            </div>
        </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-12 col-md-6">
                            <div class="input-group">
                                <span
                                    class="input-group-text bg-light border-0"
                                >
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    class="form-control border-0 bg-light"
                                    placeholder="Buscar etiquetas..."
                                    bind:value={searchTerm}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Contenido principal -->
    <div class="row">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-0">
                    {#if loading}
                        <div class="text-center py-5">
                            <div
                                class="spinner-border text-primary"
                                role="status"
                            >
                                <span class="visually-hidden">Cargando...</span>
                            </div>
                            <p class="text-muted mt-2">Cargando etiquetas...</p>
                        </div>
                    {:else if error}
                        <div class="text-center py-5">
                            <i
                                class="fas fa-exclamation-triangle fa-3x text-danger mb-3"
                            ></i>
                            <h5 class="text-danger">
                                Error al cargar etiquetas
                            </h5>
                            <p class="text-muted">{error}</p>
                        </div>
                    {:else}
                        <TagTable
                            {tagsFiltradas}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de formulario -->
<TagFormModal
    {showModal}
    {editingTag}
    {formData}
    {formSubmitting}
    onClose={closeModal}
    onSubmit={handleSubmit}
/>
