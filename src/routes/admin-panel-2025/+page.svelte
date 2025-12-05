<script>
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import {
		isAuthenticated,
		getCurrentUser,
		logout as authLogout,
	} from "$lib/utils/auth";
	import {
		collection,
		getDocs,
		query,
		where,
		limit,
		orderBy,
	} from "firebase/firestore";
	import { db } from "$lib/assets/js/firebase";

	// Stats
	let stats = {
		totalProducts: 0,
		totalSuppliers: 0,
		lowStockProducts: 0,
		activeSuppliers: 0,
	};

	let loading = true;
	let recentProducts = [];
	let recentSuppliers = [];
	let adminUser = { email: "" };

	// Navegación protegida
	async function checkAuth() {
		if (!browser) return false;

		const user = getCurrentUser();
		const currentPath = window.location.pathname;
		const isLoginPage =
			currentPath.endsWith("/login") || currentPath.endsWith("/login/");

		if (!user && !isLoginPage) {
			await goto("/admin-panel-2025/login");
			return false;
		}

		if (user && isLoginPage) {
			await goto("/admin-panel-2025/");
			return false;
		}

		return !!user;
	}

	onMount(async () => {
		if (await checkAuth()) {
			adminUser = getCurrentUser();
			await loadDashboard();
		}
	});

	// Función de cierre de sesión mejorada
	async function logout() {
		try {
			await authLogout();
			await goto("/admin-panel-2025/login");
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
		}
	}

	async function loadDashboard() {
		if (!browser) return;

		try {
			loading = true;

			// Cargar estadísticas
			const productsQuery = query(collection(db, "productos"));
			const suppliersQuery = query(
				collection(db, "proveedores"),
				where("activo", "==", true),
			);
			const lowStockQuery = query(
				collection(db, "productos"),
				where("stock", "<=", 10),
			);

			const [productsSnapshot, suppliersSnapshot, lowStockSnapshot] =
				await Promise.all([
					getDocs(productsQuery),
					getDocs(suppliersQuery),
					getDocs(lowStockQuery),
				]);

			// Actualizar estadísticas
			stats.totalProducts = productsSnapshot.size;
			stats.totalSuppliers = suppliersSnapshot.size;
			stats.lowStockProducts = lowStockSnapshot.size;
			stats.activeSuppliers = suppliersSnapshot.size;

			// Cargar productos recientes
			const recentProductsQuery = query(
				collection(db, "productos"),
				orderBy("fechaCreacion", "desc"),
				limit(5),
			);
			const recentProductsSnapshot = await getDocs(recentProductsQuery);
			recentProducts = recentProductsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// Cargar proveedores recientes
			const recentSuppliersQuery = query(
				collection(db, "proveedores"),
				orderBy("fechaCreacion", "desc"),
				limit(5),
			);
			const recentSuppliersSnapshot = await getDocs(recentSuppliersQuery);
			recentSuppliers = recentSuppliersSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
		} catch (error) {
			console.error("Error loading dashboard:", error);
		} finally {
			loading = false;
		}
	}
</script>

<!-- Resto del código del dashboard... -->

<svelte:head>
	<title>Dashboard - Panel Administrativo</title>
</svelte:head>

<div class="min-vh-100 bg-light">
	<div class="container-fluid py-4">
		<!-- Header -->
		<div class="d-flex justify-content-between align-items-center mb-4">
			<h1 class="h3 mb-0">Panel de Control</h1>
			<div class="d-flex align-items-center gap-3">
				<span class="text-muted">Bienvenido, {adminUser}</span>
				<button
					class="btn btn-outline-secondary btn-sm"
					on:click={() => {
						localStorage.removeItem("user");
						goto("/login");
					}}
				>
					Cerrar sesión
				</button>
			</div>
		</div>

		<!-- Stats Cards -->
		{#if loading}
			<div class="row mb-4">
				{#each Array(4) as _}
					<div class="col-md-3 mb-4">
						<div class="card h-100">
							<div class="card-body">
								<div class="placeholder-glow">
									<h5
										class="card-title placeholder-glow mb-3"
									>
										<span class="visually-hidden"
											>Cargando...</span
										>
										<span class="placeholder col-6"></span>
									</h5>
									<p class="card-text placeholder-glow">
										<span class="placeholder col-4"></span>
									</p>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="row mb-4">
				<!-- Total Products -->
				<div class="col-md-3 mb-4">
					<div
						class="card h-100 border-start border-primary border-4"
					>
						<div class="card-body">
							<div
								class="d-flex justify-content-between align-items-center"
							>
								<div>
									<h6 class="text-muted mb-2">
										Productos Totales
									</h6>
									<h3 class="mb-0">{stats.totalProducts}</h3>
								</div>
								<div
									class="bg-primary bg-opacity-10 p-3 rounded-3"
								>
									<i class="bi bi-box-seam text-primary fs-4"
									></i>
								</div>
							</div>
							<div class="mt-3">
								<a
									href="/admin-panel-2025/productos"
									class="btn btn-sm btn-outline-primary"
								>
									Ver todos
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Low Stock -->
				<div class="col-md-3 mb-4">
					<div
						class="card h-100 border-start border-warning border-4"
					>
						<div class="card-body">
							<div
								class="d-flex justify-content-between align-items-center"
							>
								<div>
									<h6 class="text-muted mb-2">Bajo Stock</h6>
									<h3 class="mb-0">
										{stats.lowStockProducts}
									</h3>
								</div>
								<div
									class="bg-warning bg-opacity-10 p-3 rounded-3"
								>
									<i
										class="bi bi-exclamation-triangle text-warning fs-4"
									></i>
								</div>
							</div>
							<div class="mt-3">
								<a
									href="/admin-panel-2025/productos"
									class="btn btn-sm btn-outline-warning"
								>
									Ver productos
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Total Suppliers -->
				<div class="col-md-3 mb-4">
					<div
						class="card h-100 border-start border-success border-4"
					>
						<div class="card-body">
							<div
								class="d-flex justify-content-between align-items-center"
							>
								<div>
									<h6 class="text-muted mb-2">
										Proveedores Totales
									</h6>
									<h3 class="mb-0">{stats.totalSuppliers}</h3>
								</div>
								<div
									class="bg-success bg-opacity-10 p-3 rounded-3"
								>
									<i class="bi bi-people text-success fs-4"
									></i>
								</div>
							</div>
							<div class="mt-3">
								<a
									href="/admin-panel-2025/proveedores"
									class="btn btn-sm btn-outline-success"
								>
									Ver todos
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Active Suppliers -->
				<div class="col-md-3 mb-4">
					<div class="card h-100 border-start border-info border-4">
						<div class="card-body">
							<div
								class="d-flex justify-content-between align-items-center"
							>
								<div>
									<h6 class="text-muted mb-2">
										Proveedores Activos
									</h6>
									<h3 class="mb-0">
										{stats.activeSuppliers}
									</h3>
								</div>
								<div
									class="bg-info bg-opacity-10 p-3 rounded-3"
								>
									<i class="bi bi-check-circle text-info fs-4"
									></i>
								</div>
							</div>
							<div class="mt-3">
								<a
									href="/admin-panel-2025/proveedores"
									class="btn btn-sm btn-outline-info"
								>
									Ver activos
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Recent Activity -->
		<div class="row">
			<!-- Recent Products -->
			<div class="col-md-6 mb-4">
				<div class="card h-100">
					<div
						class="card-header d-flex justify-content-between align-items-center"
					>
						<h5 class="mb-0">Productos Recientes</h5>
						<a
							href="/admin-panel-2025/productos"
							class="btn btn-sm btn-link">Ver todos</a
						>
					</div>
					<div class="card-body p-0">
						{#if loading}
							<div class="p-3">
								{#each Array(5) as _}
									<div class="placeholder-glow mb-2">
										<span
											class="placeholder col-12"
											style="height: 20px;"
										></span>
									</div>
								{/each}
							</div>
						{:else if recentProducts.length === 0}
							<div class="text-center p-4 text-muted">
								<i
									class="bi bi-inbox"
									style="font-size: 2rem; opacity: 0.5;"
								></i>
								<p class="mt-2 mb-0">
									No hay productos recientes
								</p>
							</div>
						{:else}
							<div class="list-group list-group-flush">
								{#each recentProducts as product}
									<a
										href="/admin-panel-2025/dashboard/products/edit/{product.id}"
										class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
									>
										<div class="d-flex align-items-center">
											{#if product.imagen}
												<img
													src={product.imagen}
													alt={product.nombre}
													class="rounded me-3"
													style="width: 40px; height: 40px; object-fit: cover;"
												/>
											{:else}
												<div
													class="bg-light rounded d-flex align-items-center justify-content-center me-3"
													style="width: 40px; height: 40px;"
												>
													<i
														class="bi bi-box text-muted"
													></i>
												</div>
											{/if}
											<div>
												<h6 class="mb-0">
													{product.nombre}
												</h6>
												<small class="text-muted">
													{product.categoria ||
														"Sin categoría"} • Stock:
													{product.stock || 0}
												</small>
											</div>
										</div>
										<span class="badge bg-light text-dark">
											{product.precio
												? formatCurrency(product.precio)
												: "N/A"}
										</span>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Recent Suppliers -->
			<div class="col-md-6 mb-4">
				<div class="card h-100">
					<div
						class="card-header d-flex justify-content-between align-items-center"
					>
						<h5 class="mb-0">Proveedores Recientes</h5>
						<a
							href="/admin-panel-2025/proveedores"
							class="btn btn-sm btn-link">Ver todos</a
						>
					</div>
					<div class="card-body p-0">
						{#if loading}
							<div class="p-3">
								{#each Array(5) as _}
									<div class="placeholder-glow mb-2">
										<span
											class="placeholder col-12"
											style="height: 20px;"
										></span>
									</div>
								{/each}
							</div>
						{:else if recentSuppliers.length === 0}
							<div class="text-center p-4 text-muted">
								<i
									class="bi bi-people"
									style="font-size: 2rem; opacity: 0.5;"
								></i>
								<p class="mt-2 mb-0">
									No hay proveedores recientes
								</p>
							</div>
						{:else}
							<div class="list-group list-group-flush">
								{#each recentSuppliers as supplier}
									<a
										href="/admin-panel-2025/proveedores/edit/{supplier.id}"
										class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
									>
										<div class="d-flex align-items-center">
											<div
												class="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
												style="width: 40px; height: 40px;"
											>
												<i
													class="bi bi-building text-muted"
												></i>
											</div>
											<div>
												<h6 class="mb-0">
													{supplier.nombre ||
														"Proveedor sin nombre"}
												</h6>
												<small class="text-muted">
													{supplier.email ||
														"Sin correo"}
													• {supplier.telefono ||
														"Sin teléfono"}
												</small>
											</div>
										</div>
										<button
											on:click|preventDefault={logout}
											class="dropdown-item"
										>
											<i
												class="bi bi-box-arrow-right me-2"
											></i>
											Cerrar sesión
										</button>
										<span class="badge bg-light text-dark">
											{supplier.activo
												? "Activo"
												: "Inactivo"}
										</span>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="row mt-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header">
						<h5 class="mb-0">Acciones Rápidas</h5>
					</div>
					<div class="card-body">
						<div class="d-flex flex-wrap gap-3">
							<a
								href="/admin-panel-2025/productos/nuevo"
								class="btn btn-primary"
								on:click|preventDefault={() =>
									goto("/admin-panel-2025/productos/nuevo")}
							>
								<i class="bi bi-plus-circle me-2"></i>Nuevo
								Producto
							</a>
							<a
								href="/admin-panel-2025/dashboard/suppliers/new"
								class="btn btn-success"
							>
								<i class="bi bi-person-plus me-2"></i>Nuevo
								Proveedor
							</a>
							<a
								href="/admin-panel-2025/dashboard/products?filter=low-stock"
								class="btn btn-warning"
							>
								<i class="bi bi-exclamation-triangle me-2"
								></i>Ver Bajo Stock
							</a>
							<a
								href="/admin-panel-2025/proveedores"
								class="btn btn-outline-primary"
								on:click|preventDefault={() =>
									goto("/admin-panel-2025/proveedores")}
							>
								<i class="bi bi-people me-2"></i>Gestionar
								Proveedores
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.card {
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		border: none;
		box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
	}

	.list-group-item {
		border-left: none;
		border-right: none;
		padding: 1rem 1.25rem;
	}

	.list-group-item:first-child {
		border-top: none;
	}

	.list-group-item:last-child {
		border-bottom: none;
	}
</style>
