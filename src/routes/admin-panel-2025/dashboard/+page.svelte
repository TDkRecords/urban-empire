<script>
	import { db } from "$lib/assets/js/firebase.js";
	import {
		collection,
		getDocs,
		addDoc,
		updateDoc,
		deleteDoc,
		doc,
		onSnapshot
	} from "firebase/firestore";
	import { goto } from "$app/navigation";
	import { onMount, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { 
		suppliers, 
		supplierStats,
		subscribeToSuppliers,
		unsubscribeFromSuppliers,
		createSupplier,
		updateSupplier,
		deleteSupplier
	} from '$lib/services/supplierService.js';

	// Estado general
	let activeTab = 'productos';
	let adminUser = "";
	let bootstrap;

	// Productos
	let productos = [];
	let loadingProducts = true;
	let editModeProduct = false;
	let currentProduct = null;
	let productOffcanvasInstance = null;
	let productOffcanvasElement;
	let unsubscribeProducts = null;

	// Proveedores
	let proveedores = [];
	let loadingSuppliers = true;
	let editModeSupplier = false;
	let currentSupplier = null;
	let supplierOffcanvasInstance = null;
	let supplierOffcanvasElement;

	// Form fields productos
	let productFormData = {
		nombre: "",
		descripcion: "",
		costoProd: "",
		precio: "",
		categoria: "",
		imagen: "",
		stock: "",
		proveedorId: ""
	};

	// Form fields proveedores
	let supplierFormData = {
		nombre: "",
		contacto: "",
		email: "",
		telefono: "",
		direccion: "",
		ciudad: "",
		pais: "",
		activo: true,
		notas: ""
	};

	// Suscripción reactiva a proveedores
	$: proveedores = $suppliers;

	onMount(async () => {
		if (!browser) return;

		// Check if logged in
		const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
		if (isLoggedIn !== "true") {
			goto("/admin-panel-2025");
			return;
		}

		adminUser = sessionStorage.getItem("adminUser") || "Admin";
		
		// Importar Bootstrap JS dinámicamente
		bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
		
		// Cargar datos con listeners en tiempo real
		loadProductsRealtime();
		subscribeToSuppliers();
		loadingSuppliers = false;
		
		// Initialize Bootstrap offcanvas para productos
		productOffcanvasElement = document.getElementById('productOffcanvas');
		if (productOffcanvasElement) {
			productOffcanvasInstance = new bootstrap.Offcanvas(productOffcanvasElement);
		}

		// Initialize Bootstrap offcanvas para proveedores
		supplierOffcanvasElement = document.getElementById('supplierOffcanvas');
		if (supplierOffcanvasElement) {
			supplierOffcanvasInstance = new bootstrap.Offcanvas(supplierOffcanvasElement);
		}
	});

	onDestroy(() => {
		// Limpiar instancias
		if (productOffcanvasInstance) {
			productOffcanvasInstance.dispose();
			productOffcanvasInstance = null;
		}
		if (supplierOffcanvasInstance) {
			supplierOffcanvasInstance.dispose();
			supplierOffcanvasInstance = null;
		}
		if (unsubscribeProducts) {
			unsubscribeProducts();
		}
		unsubscribeFromSuppliers();
	});

	// Cargar productos con listener en tiempo real
	function loadProductsRealtime() {
		loadingProducts = true;
		try {
			unsubscribeProducts = onSnapshot(
				collection(db, "productos"),
				(snapshot) => {
					productos = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					loadingProducts = false;
				},
				(error) => {
					console.error("Error al cargar productos:", error);
					loadingProducts = false;
				}
			);
		} catch (error) {
			console.error("Error al configurar listener de productos:", error);
			loadingProducts = false;
		}
	}

	// Funciones para productos
	function openCreateProductModal() {
		editModeProduct = false;
		currentProduct = null;
		productFormData = {
			nombre: "",
			descripcion: "",
			costoProd: "",
			precio: "",
			categoria: "",
			imagen: "",
			stock: "",
			proveedorId: ""
		};
		if (browser && productOffcanvasInstance) { 
			productOffcanvasInstance.show();
		}
	}

	function openEditProductModal(producto) {
		editModeProduct = true;
		currentProduct = producto;
		productFormData = {
			nombre: producto.nombre || "",
			descripcion: producto.descripcion || "",
			costoProd: producto.costoProd || "",
			precio: producto.precio || "",
			categoria: producto.categoria || "",
			imagen: producto.imagen || "",
			stock: producto.stock || "",
			proveedorId: producto.proveedorId || ""
		};
		if (browser && productOffcanvasInstance) { 
			productOffcanvasInstance.show();
		}
	}

	function closeProductModal() {
		if (browser && productOffcanvasInstance) { 
			productOffcanvasInstance.hide();
		}
		editModeProduct = false;
		currentProduct = null;
	}

	async function handleProductSubmit() {
		try {
			const productData = {
				nombre: productFormData.nombre,
				descripcion: productFormData.descripcion,
				costoProd: parseFloat(productFormData.costoProd) || 0,
				precio: parseFloat(productFormData.precio) || 0,
				categoria: productFormData.categoria,
				imagen: productFormData.imagen,
				stock: parseInt(productFormData.stock) || 0,
				proveedorId: productFormData.proveedorId || null
			};

			if (editModeProduct && currentProduct) {
				const productRef = doc(db, "productos", currentProduct.id);
				await updateDoc(productRef, productData);
				showNotification("Producto actualizado exitosamente", "success");
			} else {
				await addDoc(collection(db, "productos"), productData);
				showNotification("Producto creado exitosamente", "success");
			}

			closeProductModal();
		} catch (error) {
			console.error("Error al guardar producto:", error);
			showNotification("Error al guardar el producto", "error");
		}
	}

	async function handleDeleteProduct(producto) {
		if (confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
			try {
				await deleteDoc(doc(db, "productos", producto.id));
				showNotification("Producto eliminado exitosamente", "success");
			} catch (error) {
				console.error("Error al eliminar producto:", error);
				showNotification("Error al eliminar el producto", "error");
			}
		}
	}

	// Funciones para proveedores
	function openCreateSupplierModal() {
		editModeSupplier = false;
		currentSupplier = null;
		supplierFormData = {
			nombre: "",
			contacto: "",
			email: "",
			telefono: "",
			direccion: "",
			ciudad: "",
			pais: "",
			activo: true,
			notas: ""
		};
		if (browser && supplierOffcanvasInstance) { 
			supplierOffcanvasInstance.show();
		}
	}

	function openEditSupplierModal(supplier) {
		editModeSupplier = true;
		currentSupplier = supplier;
		supplierFormData = {
			nombre: supplier.nombre || "",
			contacto: supplier.contacto || "",
			email: supplier.email || "",
			telefono: supplier.telefono || "",
			direccion: supplier.direccion || "",
			ciudad: supplier.ciudad || "",
			pais: supplier.pais || "",
			activo: supplier.activo !== undefined ? supplier.activo : true,
			notas: supplier.notas || ""
		};
		if (browser && supplierOffcanvasInstance) { 
			supplierOffcanvasInstance.show();
		}
	}

	function closeSupplierModal() {
		if (browser && supplierOffcanvasInstance) { 
			supplierOffcanvasInstance.hide();
		}
		editModeSupplier = false;
		currentSupplier = null;
	}

	async function handleSupplierSubmit() {
		try {
			const supplierData = {
				nombre: supplierFormData.nombre,
				contacto: supplierFormData.contacto,
				email: supplierFormData.email,
				telefono: supplierFormData.telefono,
				direccion: supplierFormData.direccion,
				ciudad: supplierFormData.ciudad,
				pais: supplierFormData.pais,
				activo: supplierFormData.activo,
				notas: supplierFormData.notas
			};

			if (editModeSupplier && currentSupplier) {
				await updateSupplier(currentSupplier.id, supplierData);
				showNotification("Proveedor actualizado exitosamente", "success");
			} else {
				await createSupplier(supplierData);
				showNotification("Proveedor creado exitosamente", "success");
			}

			closeSupplierModal();
		} catch (error) {
			console.error("Error al guardar proveedor:", error);
			showNotification("Error al guardar el proveedor", "error");
		}
	}

	async function handleDeleteSupplier(supplier) {
		const productsCount = productos.filter(p => p.proveedorId === supplier.id).length;
		const message = productsCount > 0 
			? `Este proveedor tiene ${productsCount} producto(s) asociado(s). ¿Estás seguro de eliminarlo?`
			: `¿Estás seguro de eliminar "${supplier.nombre}"?`;
		
		if (confirm(message)) {
			try {
				await deleteSupplier(supplier.id);
				showNotification("Proveedor eliminado exitosamente", "success");
			} catch (error) {
				console.error("Error al eliminar proveedor:", error);
				showNotification("Error al eliminar el proveedor", "error");
			}
		}
	}

	// Sistema de notificaciones
	function showNotification(message, type = "info") {
		if (browser) {
			const toast = document.createElement('div');
			toast.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed top-0 end-0 m-3`;
			toast.style.zIndex = '9999';
			toast.textContent = message;
			toast.setAttribute('role', 'alert');
			document.body.appendChild(toast);
			setTimeout(() => toast.remove(), 3000);
		}
	}

	// Obtener nombre del proveedor
	function getSupplierName(proveedorId) {
		const supplier = proveedores.find(s => s.id === proveedorId);
		return supplier ? supplier.nombre : 'Sin proveedor';
	}

	// Contar productos por proveedor
	function countProductsBySupplier(supplierId) {
		return productos.filter(p => p.proveedorId === supplierId).length;
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
			<!-- Tabs Navigation -->
			<ul class="nav nav-tabs mb-4" role="tablist">
				<li class="nav-item" role="presentation">
					<button 
						class="nav-link" 
						class:active={activeTab === 'productos'}
						on:click={() => activeTab = 'productos'}
						role="tab"
						aria-selected={activeTab === 'productos'}
					>
						📦 Productos ({productos.length})
					</button>
				</li>
				<li class="nav-item" role="presentation">
					<button 
						class="nav-link" 
						class:active={activeTab === 'proveedores'}
						on:click={() => activeTab = 'proveedores'}
						role="tab"
						aria-selected={activeTab === 'proveedores'}
					>
						🏢 Proveedores ({proveedores.length})
					</button>
				</li>
			</ul>

			<!-- Productos Tab -->
			{#if activeTab === 'productos'}
			<div class="d-flex justify-content-between align-items-center mb-4">
				<h2>Gestión de Productos</h2>
				<button class="btn btn-custom-primary" on:click={openCreateProductModal}>
					+ Nuevo Producto
				</button>
			</div>

			{#if loadingProducts}
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
						<button class="btn btn-custom-primary" on:click={openCreateProductModal}>
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
									<th scope="col">Imagen</th>
									<th scope="col">Nombre</th>
									<th scope="col">Descripción</th>
									<th scope="col">Costo</th>
									<th scope="col">Precio Venta</th>
									<th scope="col">Margen</th>
									<th scope="col">Categoría</th>
									<th scope="col">Proveedor</th>
									<th scope="col">Stock</th>
									<th scope="col">Acciones</th>
								</tr>
							</thead>
							<tbody>
								{#each productos as producto (producto.id)}
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
										<td class="text-truncate" style="max-width: 200px;">
											{producto.descripcion || "-"}
										</td>
										<td class="text-success">${producto.costoProd?.toFixed(2) || "0.00"}</td>
										<td class="fw-bold text-primary">${producto.precio?.toFixed(2) || "0.00"}</td>
										<td>
											{#if producto.costoProd && producto.precio}
												{@const margen = ((producto.precio - producto.costoProd) / producto.precio * 100)}
												<span class="badge" class:bg-success={margen >= 30} class:bg-warning={margen >= 15 && margen < 30} class:bg-danger={margen < 15}>
													{margen.toFixed(1)}%
												</span>
											{:else}
												<span class="badge bg-secondary">N/A</span>
											{/if}
										</td>
										<td>{producto.categoria || "-"}</td>
										<td>
											<span class="badge bg-info text-dark">
												{getSupplierName(producto.proveedorId)}
											</span>
										</td>
										<td>
											<span class="badge" class:bg-success={producto.stock > 10} class:bg-warning={producto.stock > 0 && producto.stock <= 10} class:bg-danger={producto.stock === 0}>
												{producto.stock || 0}
											</span>
										</td>
										<td>
											<button
												class="btn btn-sm btn-success me-2"
												on:click={() => openEditProductModal(producto)}
												aria-label="Editar {producto.nombre}"
											>
												✏️ Editar
											</button>
											<button
												class="btn btn-sm btn-danger"
												on:click={() => handleDeleteProduct(producto)}
												aria-label="Eliminar {producto.nombre}"
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
			{/if}

			<!-- Proveedores Tab -->
			{#if activeTab === 'proveedores'}
			<div class="d-flex justify-content-between align-items-center mb-4">
				<h2>Gestión de Proveedores</h2>
				<button class="btn btn-custom-primary" on:click={openCreateSupplierModal}>
					+ Nuevo Proveedor
				</button>
			</div>

			<!-- Estadísticas -->
			<div class="row mb-4">
				<div class="col-md-3">
					<div class="card stat-card">
						<div class="card-body">
							<h6 class="text-muted">Total Proveedores</h6>
							<h3 class="mb-0">{$supplierStats.total}</h3>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card stat-card">
						<div class="card-body">
							<h6 class="text-muted">Activos</h6>
							<h3 class="mb-0 text-success">{$supplierStats.active}</h3>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card stat-card">
						<div class="card-body">
							<h6 class="text-muted">Inactivos</h6>
							<h3 class="mb-0 text-warning">{$supplierStats.inactive}</h3>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card stat-card">
						<div class="card-body">
							<h6 class="text-muted">Productos Totales</h6>
							<h3 class="mb-0 text-primary">{productos.length}</h3>
						</div>
					</div>
				</div>
			</div>

			{#if loadingSuppliers}
				<div class="text-center py-5">
					<div class="spinner-border text-primary" role="status">
						<span class="visually-hidden">Cargando proveedores...</span>
					</div>
					<p class="mt-3 text-muted">Cargando proveedores...</p>
				</div>
			{:else if proveedores.length === 0}
				<div class="card text-center py-5">
					<div class="card-body">
						<p class="text-muted mb-3">No hay proveedores registrados</p>
						<button class="btn btn-custom-primary" on:click={openCreateSupplierModal}>
							Crear primer proveedor
						</button>
					</div>
				</div>
			{:else}
				<div class="card shadow-sm">
					<div class="table-responsive">
						<table class="table table-hover mb-0">
							<thead class="table-light">
								<tr>
									<th scope="col">Nombre</th>
									<th scope="col">Contacto</th>
									<th scope="col">Email</th>
									<th scope="col">Teléfono</th>
									<th scope="col">Ciudad</th>
									<th scope="col">Productos</th>
									<th scope="col">Estado</th>
									<th scope="col">Acciones</th>
								</tr>
							</thead>
							<tbody>
								{#each proveedores as proveedor (proveedor.id)}
									<tr>
										<td class="fw-semibold">{proveedor.nombre}</td>
										<td>{proveedor.contacto || "-"}</td>
										<td>{proveedor.email || "-"}</td>
										<td>{proveedor.telefono || "-"}</td>
										<td>{proveedor.ciudad || "-"}</td>
										<td>
											<span class="badge bg-primary">{countProductsBySupplier(proveedor.id)}</span>
										</td>
										<td>
											<span class="badge" class:bg-success={proveedor.activo} class:bg-secondary={!proveedor.activo}>
												{proveedor.activo ? 'Activo' : 'Inactivo'}
											</span>
										</td>
										<td>
											<button
												class="btn btn-sm btn-success me-2"
												on:click={() => openEditSupplierModal(proveedor)}
												aria-label="Editar {proveedor.nombre}"
											>
												✏️ Editar
											</button>
											<button
												class="btn btn-sm btn-danger"
												on:click={() => handleDeleteSupplier(proveedor)}
												aria-label="Eliminar {proveedor.nombre}"
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
			{/if}
		</div>
	</main>
</div>

<!-- Bootstrap Offcanvas para Productos -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="productOffcanvas" aria-labelledby="productOffcanvasLabel" bind:this={productOffcanvasElement}>
	<div class="offcanvas-header">
		<h5 class="offcanvas-title" id="productOffcanvasLabel">
			{editModeProduct ? "Editar Producto" : "Nuevo Producto"}
		</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
	</div>
	<div class="offcanvas-body">
		<form on:submit|preventDefault={handleProductSubmit}>
			<div class="row g-3">
				<div class="col-12">
					<label for="nombre" class="form-label">Nombre *</label>
					<input
						type="text"
						class="form-control"
						id="nombre"
						bind:value={productFormData.nombre}
						required
					/>
				</div>

				<div class="col-12">
					<label for="categoria" class="form-label">Categoría</label>
					<input
						type="text"
						class="form-control"
						id="categoria"
						bind:value={productFormData.categoria}
					/>
				</div>

				<div class="col-12">
					<label for="proveedor" class="form-label">Proveedor</label>
					<select
						class="form-select"
						id="proveedor"
						bind:value={productFormData.proveedorId}
					>
						<option value="">Sin proveedor</option>
						{#each proveedores as proveedor}
							<option value={proveedor.id}>{proveedor.nombre}</option>
						{/each}
					</select>
				</div>

				<div class="col-12">
					<label for="descripcion" class="form-label">Descripción</label>
					<textarea
						class="form-control"
						id="descripcion"
						bind:value={productFormData.descripcion}
						rows="3"
					></textarea>
				</div>

				<div class="col-md-6">
					<label for="costoProd" class="form-label">Costo del Producto *</label>
					<div class="input-group">
						<span class="input-group-text">$</span>
						<input
							type="number"
							class="form-control"
							id="costoProd"
							bind:value={productFormData.costoProd}
							step="0.01"
							min="0"
							required
							placeholder="0.00"
						/>
					</div>
					<small class="text-muted">Precio al que llega el producto</small>
				</div>

				<div class="col-md-6">
					<label for="precio" class="form-label">Precio de Venta *</label>
					<div class="input-group">
						<span class="input-group-text">$</span>
						<input
							type="number"
							class="form-control"
							id="precio"
							bind:value={productFormData.precio}
							step="0.01"
							min="0"
							required
							placeholder="0.00"
						/>
					</div>
					{#if productFormData.costoProd && productFormData.precio}
						{@const margen = ((productFormData.precio - productFormData.costoProd) / productFormData.precio * 100)}
						<small class="text-muted">
							Margen: <span class:text-success={margen >= 30} class:text-warning={margen >= 15 && margen < 30} class:text-danger={margen < 15}>
								{margen.toFixed(1)}%
							</span>
						</small>
					{/if}
				</div>

				<div class="col-md-6">
					<label for="stock" class="form-label">Stock *</label>
					<input
						type="number"
						class="form-control"
						id="stock"
						bind:value={productFormData.stock}
						required
					/>
				</div>

				<div class="col-12">
					<label for="imagen" class="form-label">URL de Imagen</label>
					<input
						type="url"
						class="form-control"
						id="imagen"
						bind:value={productFormData.imagen}
						placeholder="https://ejemplo.com/imagen.jpg"
					/>
				</div>

				{#if productFormData.imagen}
					<div class="col-12">
						<div class="text-center">
							<img 
								src={productFormData.imagen} 
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
					{editModeProduct ? "Actualizar Producto" : "Crear Producto"}
				</button>
				<button 
					type="button" 
					class="btn btn-outline-secondary" 
					data-bs-dismiss="offcanvas"
					on:click={closeProductModal}>
					Cancelar
				</button>
			</div>
		</form>
	</div>
</div>

<!-- Bootstrap Offcanvas para Proveedores -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="supplierOffcanvas" aria-labelledby="supplierOffcanvasLabel" bind:this={supplierOffcanvasElement}>
	<div class="offcanvas-header">
		<h5 class="offcanvas-title" id="supplierOffcanvasLabel">
			{editModeSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
		</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
	</div>
	<div class="offcanvas-body">
		<form on:submit|preventDefault={handleSupplierSubmit}>
			<div class="row g-3">
				<div class="col-12">
					<label for="supplierNombre" class="form-label">Nombre *</label>
					<input
						type="text"
						class="form-control"
						id="supplierNombre"
						bind:value={supplierFormData.nombre}
						required
					/>
				</div>

				<div class="col-12">
					<label for="supplierContacto" class="form-label">Persona de Contacto</label>
					<input
						type="text"
						class="form-control"
						id="supplierContacto"
						bind:value={supplierFormData.contacto}
					/>
				</div>

				<div class="col-md-6">
					<label for="supplierEmail" class="form-label">Email</label>
					<input
						type="email"
						class="form-control"
						id="supplierEmail"
						bind:value={supplierFormData.email}
					/>
				</div>

				<div class="col-md-6">
					<label for="supplierTelefono" class="form-label">Teléfono</label>
					<input
						type="tel"
						class="form-control"
						id="supplierTelefono"
						bind:value={supplierFormData.telefono}
					/>
				</div>

				<div class="col-12">
					<label for="supplierDireccion" class="form-label">Dirección</label>
					<input
						type="text"
						class="form-control"
						id="supplierDireccion"
						bind:value={supplierFormData.direccion}
					/>
				</div>

				<div class="col-md-6">
					<label for="supplierCiudad" class="form-label">Ciudad</label>
					<input
						type="text"
						class="form-control"
						id="supplierCiudad"
						bind:value={supplierFormData.ciudad}
					/>
				</div>

				<div class="col-md-6">
					<label for="supplierPais" class="form-label">País</label>
					<input
						type="text"
						class="form-control"
						id="supplierPais"
						bind:value={supplierFormData.pais}
					/>
				</div>

				<div class="col-12">
					<label for="supplierNotas" class="form-label">Notas</label>
					<textarea
						class="form-control"
						id="supplierNotas"
						bind:value={supplierFormData.notas}
						rows="3"
					></textarea>
				</div>

				<div class="col-12">
					<div class="form-check form-switch">
						<input
							class="form-check-input"
							type="checkbox"
							id="supplierActivo"
							bind:checked={supplierFormData.activo}
						/>
						<label class="form-check-label" for="supplierActivo">
							Proveedor activo
						</label>
					</div>
				</div>
			</div>

			<div class="d-grid gap-2 mt-4">
				<button type="submit" class="btn btn-custom-primary">
					{editModeSupplier ? "Actualizar Proveedor" : "Crear Proveedor"}
				</button>
				<button 
					type="button" 
					class="btn btn-outline-secondary" 
					data-bs-dismiss="offcanvas"
					on:click={closeSupplierModal}>
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

	/* Tabs */
	.nav-tabs {
		border-bottom: 2px solid #dee2e6;
	}

	.nav-tabs .nav-link {
		border: none;
		color: #6c757d;
		font-weight: 500;
		padding: 12px 24px;
		transition: all 0.3s;
		background: transparent;
		cursor: pointer;
	}

	.nav-tabs .nav-link:hover {
		color: #667eea;
		border-color: transparent;
	}

	.nav-tabs .nav-link.active {
		color: #667eea;
		background: transparent;
		border-bottom: 3px solid #667eea;
		border-radius: 0;
	}

	/* Stat cards */
	.stat-card {
		transition: transform 0.2s, box-shadow 0.2s;
		border: none;
		border-radius: 12px;
	}

	.stat-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
	}

	.stat-card .card-body {
		padding: 1.5rem;
	}

	.stat-card h6 {
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.stat-card h3 {
		font-size: 2rem;
		font-weight: 700;
	}

	/* Offcanvas personalizado */
	:global(.offcanvas) {
		width: 500px !important;
		max-width: 100%;
	}

	/* Responsive */
	@media (max-width: 768px) {
		:global(.offcanvas) {
			width: 100% !important;
		}

		.header h1 {
			font-size: 18px;
		}

		.header-actions {
			gap: 10px;
		}

		.user-info {
			display: none;
		}

		.nav-tabs .nav-link {
			padding: 8px 12px;
			font-size: 14px;
		}

		.table {
			font-size: 14px;
		}

		.btn-sm {
			padding: 0.25rem 0.5rem;
			font-size: 0.75rem;
		}
	}

	@media (max-width: 576px) {
		.stat-card h3 {
			font-size: 1.5rem;
		}

		.d-flex.justify-content-between {
			flex-direction: column;
			gap: 1rem;
		}

		.d-flex.justify-content-between button {
			width: 100%;
		}
	}
</style>
