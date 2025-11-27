<script>
	import { db } from "$lib/assets/js/firebase.js";
	import {
		collection,
		getDocs,
		addDoc,
		updateDoc,
		deleteDoc,
		doc,
		onSnapshot,
	} from "firebase/firestore";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";

	// Componentes
	import TabsNavigation from "$lib/components/admin/TabsNavigation.svelte";
	import ProductsSection from "$lib/components/admin/ProductsSection.svelte";
	import SuppliersSection from "$lib/components/admin/SuppliersSection.svelte";
	import ProductForm from "$lib/components/admin/ProductForm.svelte";
	import SupplierForm from "$lib/components/admin/SupplierForm.svelte";

	// Estado general
	let activeTab = "productos";
	let adminUser = "";

	// Productos
	let productos = [];
	let loadingProducts = true;
	let currentProduct = null;
	let productOffcanvasInstance = null;
	let productOffcanvasElement;
	let unsubscribeProducts = null;

	// Proveedores
	let proveedores = [];
	let loadingSuppliers = true;
	let currentSupplier = null;
	let supplierOffcanvasInstance = null;
	let supplierOffcanvasElement;

	// -----------------------------
	// 🔥 PROTECCIÓN DE RUTA (ARREGLADO)
	// -----------------------------
	onMount(async () => {
		if (!browser) return; // evita SSR

		// Evita bucle al usar replaceState
		const userRaw = localStorage.getItem("user");
		let user = null;

		try {
			user = JSON.parse(userRaw);
		} catch {
			user = null;
		}

		if (!user || !user.isAdmin) {
			goto("/admin-panel-2025", { replaceState: true });
			return;
		}

		adminUser = user.email;

		// Cargar Bootstrap dinámicamente
		const bootstrap = await import("bootstrap");

		// Inicializar offcanvas
		const initOffcanvas = () => {
			if (productOffcanvasElement && !productOffcanvasInstance) {
				productOffcanvasInstance = new bootstrap.Offcanvas(
					document.getElementById("productOffcanvas"),
				);
			}

			if (supplierOffcanvasElement && !supplierOffcanvasInstance) {
				supplierOffcanvasInstance = new bootstrap.Offcanvas(
					document.getElementById("supplierOffcanvas"),
				);
			}
		};

		if (document.readyState === "complete") initOffcanvas();
		else window.addEventListener("load", initOffcanvas);

		// Cargar datos
		loadProductsRealtime();
		subscribeToSuppliers(handleSuppliersUpdate);

		return () => {
			if (unsubscribeProducts) unsubscribeProducts();
			unsubscribeFromSuppliers();
		};
	});

	// -----------------------------
	// 🔥 PRODUCTOS
	// -----------------------------
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
					console.error("Error cargando productos:", error);
					loadingProducts = false;
				},
			);
		} catch (error) {
			console.error("Error inicializando productos:", error);
			loadingProducts = false;
		}
	}

	async function handleSaveProduct(productData) {
		try {
			if (currentProduct) {
				await updateDoc(
					doc(db, "productos", currentProduct.id),
					productData,
				);
			} else {
				await addDoc(collection(db, "productos"), productData);
			}
			closeProductModal();
		} catch (error) {
			console.error("Error guardando producto:", error);
		}
	}

	async function handleDeleteProduct(producto) {
		if (confirm(`¿Eliminar producto ${producto.nombre}?`)) {
			try {
				await deleteDoc(doc(db, "productos", producto.id));
			} catch (error) {
				console.error("Error eliminando producto:", error);
			}
		}
	}

	// -----------------------------
	// 🔥 PROVEEDORES
	// -----------------------------
	function handleSuppliersUpdate(updatedSuppliers) {
		proveedores = updatedSuppliers;
		loadingSuppliers = false;
	}

	async function handleSaveSupplier(supplierData) {
		try {
			if (currentSupplier) {
				await updateSupplier(currentSupplier.id, supplierData);
			} else {
				await createSupplier(supplierData);
			}
			closeSupplierModal();
		} catch (error) {
			console.error("Error guardando proveedor:", error);
		}
	}

	async function handleDeleteSupplier(proveedor) {
		if (confirm(`¿Eliminar proveedor ${proveedor.nombre}?`)) {
			try {
				await deleteSupplier(proveedor.id);
			} catch (error) {
				console.error("Error eliminando proveedor:", error);
			}
		}
	}

	// -----------------------------
	// 🔥 MODALES
	// -----------------------------
	function openProductModal(product = null) {
		currentProduct = product;
		productOffcanvasInstance?.show();
	}

	function closeProductModal() {
		currentProduct = null;
		productOffcanvasInstance?.hide();
	}

	function openSupplierModal(supplier = null) {
		currentSupplier = supplier;
		supplierOffcanvasInstance?.show();
	}

	function closeSupplierModal() {
		currentSupplier = null;
		supplierOffcanvasInstance?.hide();
	}
</script>

<svelte:head>
	<title>Dashboard - Panel Administrativo</title>
</svelte:head>

<div class="min-vh-100 bg-light">
	<header class="bg-dark text-white py-3 shadow-sm">
		<div
			class="container d-flex justify-content-between align-items-center"
		>
			<h1 class="h4 mb-0">Panel Administrativo</h1>
			<div class="d-flex align-items-center gap-3">
				<small class="text-white-50">{adminUser}</small>
				<button
					class="btn btn-outline-light btn-sm"
					on:click={() => {
						localStorage.removeItem("user");
						goto("/login");
					}}
				>
					Cerrar sesión
				</button>
			</div>
		</div>
	</header>

	<main class="py-4">
		<div class="container">
			<!-- Navegación por pestañas -->
			<TabsNavigation
				bind:activeTab
				{productos}
				{proveedores}
				on:tabChange={(e) => (activeTab = e.detail)}
			/>

			<!-- Contenido de las pestañas -->
			{#if activeTab === "productos"}
				<ProductsSection
					{productos}
					loading={loadingProducts}
					openEditProductModal={openProductModal}
					{handleDeleteProduct}
				/>
			{:else if activeTab === "proveedores"}
				<SuppliersSection
					{proveedores}
					loading={loadingSuppliers}
					openCreateSupplierModal={() => openSupplierModal()}
					openEditSupplierModal={openSupplierModal}
					{handleDeleteSupplier}
				/>
			{/if}
		</div>
	</main>
</div>

<!-- Offcanvas para Productos -->
<div
	class="offcanvas offcanvas-end"
	style="--bs-offcanvas-width: 500px;"
	tabindex="-1"
	id="productOffcanvas"
	aria-labelledby="productOffcanvasLabel"
	bind:this={productOffcanvasElement}
>
	<ProductForm
		product={currentProduct || {}}
		isEditing={!!currentProduct}
		onSave={handleSaveProduct}
		onClose={closeProductModal}
	/>
</div>

<!-- Offcanvas para Proveedores -->
<div
	class="offcanvas offcanvas-end"
	style="--bs-offcanvas-width: 500px;"
	tabindex="-1"
	id="supplierOffcanvas"
	aria-labelledby="supplierOffcanvasLabel"
	bind:this={supplierOffcanvasElement}
>
	<SupplierForm
		supplier={currentSupplier || {}}
		isEditing={!!currentSupplier}
		onSave={handleSaveSupplier}
		onClose={closeSupplierModal}
	/>
</div>
