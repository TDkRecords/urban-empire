<script>
	import { db } from "$lib/assets/js/firebase.js";
	import {
		collection,
		getDocs,
		addDoc,
		updateDoc,
		deleteDoc,
		doc,
	} from "firebase/firestore";
	import { goto } from "$app/navigation";
	import { onMount, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import 'bootstrap/dist/css/bootstrap.min.css';

	let productos = [];
	let loading = true;
	let editMode = false;
	let currentProduct = null;
	let adminUser = "";
	let offcanvasInstance = null;
	let offcanvasElement;

	// Form fields
	let formData = {
		nombre: "",
		descripcion: "",
		precio: "",
		categoria: "",
		imagen: "",
		stock: "",
	};

	onMount(async () => {
		// Solo ejecutar en el navegador
		if (!browser) return;

		// Check if logged in
		const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
		if (isLoggedIn !== "true") {
			goto("/admin-panel-2025");
			return;
		}

		adminUser = sessionStorage.getItem("adminUser") || "Admin";
		await loadProducts();
		
		// Importar Bootstrap JS dinámicamente
		const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
		
		// Initialize Bootstrap offcanvas
		offcanvasElement = document.getElementById('productOffcanvas');
		if (offcanvasElement) {
			offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
		}
	});

	onDestroy(() => {
		// Limpiar la instancia del offcanvas al desmontar
		if (offcanvasInstance) {
			offcanvasInstance.dispose();
			offcanvasInstance = null;
		}
	});

	async function loadProducts() {
		loading = true;
		try {
			const querySnapshot = await getDocs(collection(db, "productos"));
			productos = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
		} catch (error) {
			console.error("Error al cargar productos:", error);
			alert("Error al cargar los productos");
		} finally {
			loading = false;
		}
	}

	function openCreateModal() {
		editMode = false;
		currentProduct = null;
		formData = {
			nombre: "",
			descripcion: "",
			precio: "",
			categoria: "",
			imagen: "",
			stock: "",
		};
		if (browser && offcanvasInstance) { 
			offcanvasInstance.show();
		}
	}

	function openEditModal(producto) {
		editMode = true;
		currentProduct = producto;
		formData = {
			nombre: producto.nombre || "",
			descripcion: producto.descripcion || "",
			precio: producto.precio || "",
			categoria: producto.categoria || "",
			imagen: producto.imagen || "",
			stock: producto.stock || "",
		};
		if (browser && offcanvasInstance) { 
			offcanvasInstance.show();
		}
	}

	function closeModal() {
		if (browser && offcanvasInstance) { 
			offcanvasInstance.hide();
		}
		editMode = false;
		currentProduct = null;
	}

	async function handleSubmit() {
		try {
			const productData = {
				nombre: formData.nombre,
				descripcion: formData.descripcion,
				precio: parseFloat(formData.precio) || 0,
				categoria: formData.categoria,
				imagen: formData.imagen,
				stock: parseInt(formData.stock) || 0,
			};

			if (editMode && currentProduct) {
				// Update existing product
				const productRef = doc(db, "productos", currentProduct.id);
				await updateDoc(productRef, productData);
				alert("Producto actualizado exitosamente");
			} else {
				// Create new product
				await addDoc(collection(db, "productos"), productData);
				alert("Producto creado exitosamente");
			}

			closeModal();
			await loadProducts();
		} catch (error) {
			console.error("Error al guardar producto:", error);
			alert("Error al guardar el producto");
		}
	}

	async function handleDelete(producto) {
		if (confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
			try {
				await deleteDoc(doc(db, "productos", producto.id));
				alert("Producto eliminado exitosamente");
				await loadProducts();
			} catch (error) {
				console.error("Error al eliminar producto:", error);
				alert("Error al eliminar el producto");
			}
		}
	}

	function handleLogout() {
		sessionStorage.removeItem("adminLoggedIn");
		sessionStorage.removeItem("adminUser");
		goto("/admin-panel-2025");
	}
</script>

<svelte:head>
	<title>Dashboard - Panel Administrativo</title>
</svelte:head>

<div class="dashboard">
	<header class="header">
		<div class="header-content">
			<h1>Panel Administrativo</h1>
			<div class="header-actions">
				<span class="user-info">👤 {adminUser}</span>
				<button class="logout-btn" on:click={handleLogout}
					>Cerrar Sesión</button
				>
			</div>
		</div>
	</header>

	<main class="main-content">
		<div class="container-fluid">
			<div class="d-flex justify-content-between align-items-center mb-4">
				<h2>Gestión de Productos</h2>
				<button class="btn btn-custom-primary" on:click={openCreateModal}>
					+ Nuevo Producto
				</button>
			</div>

			{#if loading}
				<div class="text-center py-5">
					<div class="spinner-border text-primary" role="status">
						<span class="visually-hidden">Cargando...</span>
					</div>
					<p class="mt-3 text-muted">Cargando productos...</p>
				</div>
			{:else if productos.length === 0}
				<div class="card text-center py-5">
					<div class="card-body">
						<p class="text-muted mb-3">No hay productos registrados</p>
						<button class="btn btn-custom-primary" on:click={openCreateModal}>
							Crear primer producto
						</button>
					</div>
				</div>
			{:else}
				<div class="card shadow-sm">
					<div class="table-responsive">
						<table class="table table-hover mb-0">
							<thead class="table-light">
								<tr>
									<th>Imagen</th>
									<th>Nombre</th>
									<th>Descripción</th>
									<th>Precio</th>
									<th>Categoría</th>
									<th>Stock</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{#each productos as producto}
									<tr>
										<td>
											{#if producto.imagen}
												<img
													src={producto.imagen}
													alt={producto.nombre}
													class="product-img rounded"
												/>
											{:else}
												<div class="no-image bg-light rounded text-muted">Sin imagen</div>
											{/if}
										</td>
										<td class="fw-semibold">{producto.nombre}</td>
										<td class="text-truncate" style="max-width: 300px;">
											{producto.descripcion || "-"}
										</td>
										<td class="fw-bold">${producto.precio?.toFixed(2) || "0.00"}</td>
										<td>{producto.categoria || "-"}</td>
										<td>
											<span class="badge bg-secondary">{producto.stock || 0}</span>
										</td>
										<td>
											<button
												class="btn btn-sm btn-success me-2"
												on:click={() => openEditModal(producto)}
											>
												✏️ Editar
											</button>
											<button
												class="btn btn-sm btn-danger"
												on:click={() => handleDelete(producto)}
											>
												🗑️ Eliminar
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>

<!-- Bootstrap Offcanvas -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="productOffcanvas" aria-labelledby="productOffcanvasLabel" bind:this={offcanvasElement}>
	<div class="offcanvas-header">
		<h5 class="offcanvas-title" id="productOffcanvasLabel">
			{editMode ? "Editar Producto" : "Nuevo Producto"}
		</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
	</div>
	<div class="offcanvas-body">
		<form on:submit|preventDefault={handleSubmit}>
			<div class="row g-3">
				<div class="col-12">
					<label for="nombre" class="form-label">Nombre *</label>
					<input
						type="text"
						class="form-control"
						id="nombre"
						bind:value={formData.nombre}
						required
					/>
				</div>

				<div class="col-12">
					<label for="categoria" class="form-label">Categoría</label>
					<input
						type="text"
						class="form-control"
						id="categoria"
						bind:value={formData.categoria}
					/>
				</div>

				<div class="col-12">
					<label for="descripcion" class="form-label">Descripción</label>
					<textarea
						class="form-control"
						id="descripcion"
						bind:value={formData.descripcion}
						rows="3"
					></textarea>
				</div>

				<div class="col-md-6">
					<label for="precio" class="form-label">Precio *</label>
					<input
						type="number"
						class="form-control"
						id="precio"
						bind:value={formData.precio}
						step="0.01"
						required
					/>
				</div>

				<div class="col-md-6">
					<label for="stock" class="form-label">Stock *</label>
					<input
						type="number"
						class="form-control"
						id="stock"
						bind:value={formData.stock}
						required
					/>
				</div>

				<div class="col-12">
					<label for="imagen" class="form-label">URL de Imagen</label>
					<input
						type="url"
						class="form-control"
						id="imagen"
						bind:value={formData.imagen}
						placeholder="https://ejemplo.com/imagen.jpg"
					/>
				</div>

				{#if formData.imagen}
					<div class="col-12">
						<div class="text-center">
							<img 
								src={formData.imagen} 
								alt="Vista previa" 
								class="img-fluid rounded shadow-sm"
								style="max-height: 200px;"
							/>
						</div>
					</div>
				{/if}
			</div>

			<div class="d-grid gap-2 mt-4">
				<button type="submit" class="btn btn-custom-primary">
					{editMode ? "Actualizar Producto" : "Crear Producto"}
				</button>
				<button 
					type="button" 
					class="btn btn-outline-secondary" 
					data-bs-dismiss="offcanvas"
					on:click={closeModal}>
					Cancelar
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.dashboard {
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	.header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 20px 0;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.header-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header h1 {
		margin: 0;
		font-size: 24px;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.user-info {
		font-size: 14px;
	}

	.logout-btn {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		padding: 8px 16px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.3s;
	}

	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.main-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 30px 20px;
	}

	/* Custom button with gradient */
	.btn-custom-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 12px 24px;
		font-weight: 600;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.btn-custom-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.product-img {
		width: 60px;
		height: 60px;
		object-fit: cover;
	}

	.no-image {
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
	}

	/* Offcanvas personalizado */
	:global(.offcanvas) {
		width: 500px !important;
		max-width: 100%;
	}

	@media (max-width: 768px) {
		:global(.offcanvas) {
			width: 100% !important;
		}
	}
</style>
