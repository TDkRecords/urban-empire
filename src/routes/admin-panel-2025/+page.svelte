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
		orderBy,
		limit,
		onSnapshot,
	} from "firebase/firestore";
	import { db } from "$lib/assets/js/firebase";
	import { fade, fly, scale } from "svelte/transition";

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
	let unsubscribeProducts = null;
	let unsubscribeSuppliers = null;

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
			// Limpiar suscripciones
			if (unsubscribeProducts) unsubscribeProducts();
			if (unsubscribeSuppliers) unsubscribeSuppliers();

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

			// Cargar estadísticas de productos
			const productsQuery = query(collection(db, "productos"));
			const productsSnapshot = await getDocs(productsQuery);
			stats.totalProducts = productsSnapshot.size;

			// Productos con bajo stock
			const lowStockProducts = productsSnapshot.docs.filter(
				(doc) => (doc.data().stock || 0) <= 10,
			);
			stats.lowStockProducts = lowStockProducts.length;

			// Cargar estadísticas de proveedores
			const suppliersQuery = query(collection(db, "proveedores"));
			const suppliersSnapshot = await getDocs(suppliersQuery);
			stats.totalSuppliers = suppliersSnapshot.size;

			// Proveedores activos
			const activeSuppliers = suppliersSnapshot.docs.filter(
				(doc) => doc.data().activo === true,
			);
			stats.activeSuppliers = activeSuppliers.length;

			// Suscribirse a productos recientes en tiempo real
			const recentProductsQuery = query(
				collection(db, "productos"),
				orderBy("nombre", "asc"),
				limit(5),
			);

			unsubscribeProducts = onSnapshot(
				recentProductsQuery,
				(snapshot) => {
					recentProducts = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
				},
			);

			// Suscribirse a proveedores recientes en tiempo real
			const recentSuppliersQuery = query(
				collection(db, "proveedores"),
				orderBy("nombre", "asc"),
				limit(5),
			);

			unsubscribeSuppliers = onSnapshot(
				recentSuppliersQuery,
				(snapshot) => {
					recentSuppliers = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
				},
			);
		} catch (error) {
			console.error("Error loading dashboard:", error);
		} finally {
			loading = false;
		}
	}

	function formatCurrency(amount) {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
		}).format(amount || 0);
	}

	// Limpiar suscripciones al desmontar
	import { onDestroy } from "svelte";
	onDestroy(() => {
		if (unsubscribeProducts) unsubscribeProducts();
		if (unsubscribeSuppliers) unsubscribeSuppliers();
	});
</script>

<svelte:head>
	<title>Dashboard - Panel Administrativo</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
	/>
</svelte:head>

<div class="min-vh-100 dashboard-bg">
	<div class="container-fluid py-4">
		<!-- Header con animación -->
		<div
			class="d-flex justify-content-between align-items-center mb-4"
			in:fly={{ y: -20, duration: 600 }}
		>
			<div>
				<h1 class="h3 mb-0 fw-bold">
					<i class="bi bi-grid-fill me-2 text-primary"></i>
					Panel de Control
				</h1>
				<p class="text-muted mb-0 mt-1">
					Bienvenido de vuelta, {adminUser.email}
				</p>
			</div>
			<button class="btn btn-outline-danger btn-sm" on:click={logout}>
				<i class="bi bi-box-arrow-right me-1"></i>
				Cerrar sesión
			</button>
		</div>

		<!-- Stats Cards con animación -->
		{#if loading}
			<div class="row g-4 mb-4">
				{#each Array(4) as _, i}
					<div
						class="col-md-6 col-xl-3"
						in:scale={{ duration: 300, delay: i * 100 }}
					>
						<div class="card stat-card h-100 border-0 shadow-sm">
							<div class="card-body">
								<div class="placeholder-glow">
									<span class="placeholder col-6"></span>
									<span class="placeholder col-4 d-block mt-3"
									></span>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="row g-4 mb-4">
				<!-- Total Products -->
				<div
					class="col-md-6 col-xl-3"
					in:scale={{ duration: 400, delay: 0 }}
				>
					<div
						class="card stat-card stat-primary h-100 border-0 shadow-sm"
					>
						<div class="card-body">
							<div
								class="d-flex justify-content-between align-items-start"
							>
								<div>
									<p
										class="text-muted mb-1 small text-uppercase fw-semibold"
									>
										Productos Totales
									</p>
									<h2 class="mb-0 fw-bold">
										{stats.totalProducts}
									</h2>
								</div>
								<div class="stat-icon stat-icon-primary">
									<i class="bi bi-box-seam"></i>
								</div>
							</div>
							<div class="mt-3">
								<a
									href="/admin-panel-2025/productos"
									class="btn btn-sm btn-outline-primary"
								>
									<i class="bi bi-arrow-right me-1"></i>
									Ver todos
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Low Stock -->
				<div
					class="col-md-6 col-xl-3"
					in:scale={{ duration: 400, delay: 100 }}
				>
					<div
						class="card stat-card stat-warning h-100 border-0 shadow-sm"
					>
						<div class="card-body">
							<div
								class="d-flex justify-content-between align-items-start"
							>
								<div>
									<p
										class="text-muted mb-1 small text-uppercase fw-semibold"
									>
										Bajo Stock
									</p>
									<h2 class="mb-0 fw-bold">
										{stats.lowStockProducts}
									</h2>
								</div>
								<div class="stat-icon stat-icon-warning">
									<i class="bi bi-exclamation-triangle"></i>
								</div>
							</div>
							<div class="mt-3">
								<a
									href="/admin-panel-2025/productos"
									class="btn btn-sm btn-outline-warning"
								>
									<i class="bi bi-arrow-right me-1"></i>
									Ver productos
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Total Suppliers -->
				<div
					class="col-md-6 col-xl-3"
					in:scale={{ duration: 400, delay: 200 }}
				>
					<div
						class="card stat-card stat-success h-100 border-0 shadow-sm"
					>
						<div class="card-body">
							<div
								class="d-flex justify-content-between align-items-start"
							>
								<div>
									<p
										class="text-muted mb-1 small text-uppercase fw-semibold"
									>
										Proveedores Totales
									</p>
									<h2 class="mb-0 fw-bold">
										{stats.totalSuppliers}
									</h2>
								</div>
								<div class="stat-icon stat-icon-success">
									<i class="bi bi-people"></i>
								</div>
							</div>
							<div class="mt-3">
								<a
									href="/admin-panel-2025/proveedores"
									class="btn btn-sm btn-outline-success"
								>
									<i class="bi bi-arrow-right me-1"></i>
									Ver todos
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Active Suppliers -->
				<div
					class="col-md-6 col-xl-3"
					in:scale={{ duration: 400, delay: 300 }}
				>
					<div
						class="card stat-card stat-info h-100 border-0 shadow-sm"
					>
						<div class="card-body">
							<div
								class="d-flex justify-content-between align-items-start"
							>
								<div>
									<p
										class="text-muted mb-1 small text-uppercase fw-semibold"
									>
										Proveedores Activos
									</p>
									<h2 class="mb-0 fw-bold">
										{stats.activeSuppliers}
									</h2>
								</div>
								<div class="stat-icon stat-icon-info">
									<i class="bi bi-check-circle"></i>
								</div>
							</div>
							<div class="mt-3">
								<a
									href="/admin-panel-2025/proveedores"
									class="btn btn-sm btn-outline-info"
								>
									<i class="bi bi-arrow-right me-1"></i>
									Ver activos
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Recent Activity -->
		<div class="row g-4">
			<!-- Recent Products -->
			<div
				class="col-lg-6"
				in:fly={{ x: -50, duration: 600, delay: 400 }}
			>
				<div class="card h-100 border-0 shadow-sm">
					<div
						class="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3"
					>
						<h5 class="mb-0 fw-semibold">
							<i class="bi bi-box-seam text-primary me-2"></i>
							Productos Recientes
						</h5>
						<a
							href="/admin-panel-2025/productos"
							class="btn btn-sm btn-link text-decoration-none"
						>
							Ver todos <i class="bi bi-arrow-right"></i>
						</a>
					</div>
					<div class="card-body p-0">
						{#if loading}
							<div class="p-4">
								{#each Array(5) as _}
									<div class="placeholder-glow mb-3">
										<span class="placeholder col-12"></span>
									</div>
								{/each}
							</div>
						{:else if recentProducts.length === 0}
							<div class="text-center p-5">
								<i
									class="bi bi-inbox text-muted"
									style="font-size: 3rem; opacity: 0.3;"
								></i>
								<p class="mt-3 text-muted mb-0">
									No hay productos recientes
								</p>
							</div>
						{:else}
							<div class="list-group list-group-flush">
								{#each recentProducts as product, i}
									<div
										class="list-group-item list-group-item-action"
										in:fly={{
											x: -20,
											duration: 300,
											delay: i * 50,
										}}
									>
										<div
											class="d-flex justify-content-between align-items-center"
										>
											<div
												class="d-flex align-items-center gap-3"
											>
												{#if product.imagen}
													<img
														src={product.imagen}
														alt={product.nombre}
														class="rounded product-thumb"
													/>
												{:else}
													<div
														class="product-thumb-placeholder"
													>
														<i class="bi bi-image"
														></i>
													</div>
												{/if}
												<div>
													<h6
														class="mb-1 fw-semibold"
													>
														{product.nombre}
													</h6>
													<div
														class="d-flex gap-2 align-items-center"
													>
														{#if product.categoria}
															<span
																class="badge bg-light text-dark"
																>{product.categoria}</span
															>
														{/if}
														<small
															class="text-muted"
															>Stock: {product.stock ||
																0}</small
														>
													</div>
												</div>
											</div>
											<div class="text-end">
												<div
													class="fw-bold text-primary"
												>
													{formatCurrency(
														product.precio,
													)}
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Recent Suppliers -->
			<div class="col-lg-6" in:fly={{ x: 50, duration: 600, delay: 400 }}>
				<div class="card h-100 border-0 shadow-sm">
					<div
						class="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3"
					>
						<h5 class="mb-0 fw-semibold">
							<i class="bi bi-people text-success me-2"></i>
							Proveedores Recientes
						</h5>
						<a
							href="/admin-panel-2025/proveedores"
							class="btn btn-sm btn-link text-decoration-none"
						>
							Ver todos <i class="bi bi-arrow-right"></i>
						</a>
					</div>
					<div class="card-body p-0">
						{#if loading}
							<div class="p-4">
								{#each Array(5) as _}
									<div class="placeholder-glow mb-3">
										<span class="placeholder col-12"></span>
									</div>
								{/each}
							</div>
						{:else if recentSuppliers.length === 0}
							<div class="text-center p-5">
								<i
									class="bi bi-people text-muted"
									style="font-size: 3rem; opacity: 0.3;"
								></i>
								<p class="mt-3 text-muted mb-0">
									No hay proveedores recientes
								</p>
							</div>
						{:else}
							<div class="list-group list-group-flush">
								{#each recentSuppliers as supplier, i}
									<div
										class="list-group-item list-group-item-action"
										in:fly={{
											x: 20,
											duration: 300,
											delay: i * 50,
										}}
									>
										<div
											class="d-flex justify-content-between align-items-center"
										>
											<div
												class="d-flex align-items-center gap-3"
											>
												<div class="supplier-avatar">
													<i class="bi bi-building"
													></i>
												</div>
												<div>
													<h6
														class="mb-1 fw-semibold"
													>
														{supplier.nombre ||
															"Sin nombre"}
													</h6>
													<div
														class="d-flex gap-2 flex-wrap"
													>
														{#if supplier.email}
															<small
																class="text-muted"
															>
																<i
																	class="bi bi-envelope me-1"

																></i>{supplier.email}
															</small>
														{/if}
														{#if supplier.telefono}
															<small
																class="text-muted"
															>
																<i
																	class="bi bi-telephone me-1"

																></i>{supplier.telefono}
															</small>
														{/if}
													</div>
												</div>
											</div>
											<div>
												<span
													class="badge bg-{supplier.activo
														? 'success'
														: 'secondary'}"
												>
													{supplier.activo
														? "Activo"
														: "Inactivo"}
												</span>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="row mt-4" in:fly={{ y: 50, duration: 600, delay: 600 }}>
			<div class="col-12">
				<div class="card border-0 shadow-sm">
					<div class="card-header bg-white border-bottom py-3">
						<h5 class="mb-0 fw-semibold">
							<i class="bi bi-lightning-charge text-warning me-2"
							></i>
							Acciones Rápidas
						</h5>
					</div>
					<div class="card-body">
						<div class="row g-3">
							<div class="col-md-6 col-lg-3">
								<a
									href="/admin-panel-2025/productos"
									class="btn btn-primary w-100 btn-action"
								>
									<i class="bi bi-plus-circle me-2"></i>
									Nuevo Producto
								</a>
							</div>
							<div class="col-md-6 col-lg-3">
								<a
									href="/admin-panel-2025/proveedores"
									class="btn btn-success w-100 btn-action"
								>
									<i class="bi bi-person-plus me-2"></i>
									Nuevo Proveedor
								</a>
							</div>
							<div class="col-md-6 col-lg-3">
								<a
									href="/admin-panel-2025/productos"
									class="btn btn-warning w-100 btn-action"
								>
									<i class="bi bi-exclamation-triangle me-2"
									></i>
									Ver Bajo Stock
								</a>
							</div>
							<div class="col-md-6 col-lg-3">
								<a
									href="/admin-panel-2025/proveedores"
									class="btn btn-info w-100 btn-action"
								>
									<i class="bi bi-people me-2"></i>
									Gestionar Proveedores
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard-bg {
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	}

	.stat-card {
		transition: all 0.3s ease;
		border-radius: 12px;
		overflow: hidden;
	}

	.stat-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
	}

	.stat-icon {
		width: 50px;
		height: 50px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
	}

	.stat-icon-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.stat-icon-warning {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		color: white;
	}

	.stat-icon-success {
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		color: white;
	}

	.stat-icon-info {
		background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
		color: white;
	}

	.card {
		border-radius: 12px;
	}

	.product-thumb {
		width: 50px;
		height: 50px;
		object-fit: cover;
		border-radius: 8px;
	}

	.product-thumb-placeholder {
		width: 50px;
		height: 50px;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		font-size: 1.5rem;
	}

	.supplier-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.5rem;
	}

	.list-group-item {
		border-left: none;
		border-right: none;
		padding: 1rem 1.5rem;
		transition: all 0.2s ease;
	}

	.list-group-item:hover {
		background-color: #f8f9fa;
		transform: translateX(5px);
	}

	.list-group-item:first-child {
		border-top: none;
	}

	.list-group-item:last-child {
		border-bottom: none;
	}

	.btn-action {
		padding: 0.75rem 1rem;
		font-weight: 600;
		transition: all 0.3s ease;
		border-radius: 8px;
	}

	.btn-action:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}
</style>
