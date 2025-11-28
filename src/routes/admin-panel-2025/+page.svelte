<script context="module">
	export const load = async () => {
		if (import.meta.env.SSR) return {};

		const isLoggedIn =
			sessionStorage.getItem("adminLoggedIn") ||
			localStorage.getItem("adminLoggedIn");
		if (!isLoggedIn) {
			return {
				status: 302,
				redirect: "/admin-panel-2025/login",
			};
		}

		return {};
	};
</script>

<script>
	import {
		collection,
		getDocs,
		addDoc,
		updateDoc,
		deleteDoc,
		doc,
		onSnapshot,
	} from "firebase/firestore";
	import { db } from "$lib/assets/js/firebase.js";

	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";

	// Componentes
	import TabsNavigation from "$lib/components/admin/TabsNavigation.svelte";
	import ProductsSection from "$lib/components/admin/ProductsSection.svelte";
	import SuppliersSection from "$lib/components/admin/SuppliersSection.svelte";
	import ProductForm from "$lib/components/admin/ProductForm.svelte";
	import SupplierForm from "$lib/components/admin/SupplierForm.svelte";

	// Estado general
	let adminUser = "";
	let activeTab = "productos";

	// Productos
	let productos = [];
	let loadingProducts = true;
	let currentProduct = null;
	let productOffcanvasElement;
	let productOffcanvasInstance = null;
	let unsubscribeProducts = null;

	// Proveedores
	let proveedores = [];
	let loadingSuppliers = true;
	let currentSupplier = null;
	let supplierOffcanvasElement;
	let supplierOffcanvasInstance = null;
	let unsubscribeSuppliers = null;

	onMount(async () => {
		if (!browser) return;

		console.log("Admin panel mounted");

		// Check both sessionStorage and localStorage for backward compatibility
		const isLoggedIn =
			sessionStorage.getItem("adminLoggedIn") ||
			localStorage.getItem("adminLoggedIn");
		const user =
			sessionStorage.getItem("adminUser") ||
			localStorage.getItem("adminUser");

		console.log("Auth state:", { isLoggedIn, user });

		if (isLoggedIn !== "true" || !user) {
			console.log("User not authenticated, redirecting to login...");
			goto("/admin-panel-2025/login", { replaceState: true });
			return;
		}

		try {
			adminUser = JSON.parse(user); // Try to parse if it's a JSON string
		} catch (e) {
			adminUser = user; // Fallback to string if not JSON
		}

		console.log("Authenticated user:", adminUser);

		// Initialize Bootstrap
		try {
			const bootstrap = await import("bootstrap");

			// Initialize offcanvas elements
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

			// Load products
			await loadProducts();
		} catch (error) {
			console.error("Error initializing admin panel:", error);
		}

		// Cleanup
		return () => {
			if (unsubscribeProducts) unsubscribeProducts();
			if (unsubscribeSuppliers) unsubscribeSuppliers();
		};
	});

	// New function to load products
	async function loadProducts() {
		loadingProducts = true;
		try {
			// First, get products directly to check connection
			const querySnapshot = await getDocs(collection(db, "productos"));
			console.log(
				"Products from direct query:",
				querySnapshot.docs.length,
			);

			// Then set up real-time subscription
			unsubscribeProducts = onSnapshot(
				collection(db, "productos"),
				(snapshot) => {
					productos = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					console.log("Products updated:", productos.length);
					loadingProducts = false;
				},
				(error) => {
					console.error("Error in products subscription:", error);
					loadingProducts = false;
				},
			);
		} catch (error) {
			console.error("Error loading products:", error);
			loadingProducts = false;
		}
	}

	// -----------------------------
	// 🔥 CRUD PRODUCTOS
	// -----------------------------
	async function handleSaveProduct(data) {
		try {
			if (currentProduct) {
				await updateDoc(doc(db, "productos", currentProduct.id), data);
			} else {
				await addDoc(collection(db, "productos"), data);
			}
			closeProductModal();
		} catch (err) {
			console.error("Error guardando producto:", err);
		}
	}

	async function handleDeleteProduct(p) {
		if (confirm(`¿Eliminar producto "${p.nombre}"?`)) {
			await deleteDoc(doc(db, "productos", p.id));
		}
	}

	// -----------------------------
	// 🔥 CRUD PROVEEDORES
	// -----------------------------
	async function handleSaveSupplier(data) {
		try {
			if (currentSupplier) {
				await updateDoc(
					doc(db, "proveedores", currentSupplier.id),
					data,
				);
			} else {
				await addDoc(collection(db, "proveedores"), data);
			}
			closeSupplierModal();
		} catch (err) {
			console.error("Error guardando proveedor:", err);
		}
	}

	async function handleDeleteSupplier(s) {
		if (confirm(`¿Eliminar proveedor "${s.nombre}"?`)) {
			await deleteDoc(doc(db, "proveedores", s.id));
		}
	}

	// -----------------------------
	// 🔥 MODALES PRODUCTOS
	// -----------------------------
	function openProductModal(product = null) {
		currentProduct = product;
		productOffcanvasInstance?.show();
	}

	function closeProductModal() {
		currentProduct = null;
		productOffcanvasInstance?.hide();
	}

	// -----------------------------
	// 🔥 MODALES PROVEEDORES
	// -----------------------------
	function openSupplierModal(supplier = null) {
		currentSupplier = supplier;
		supplierOffcanvasInstance?.show();
	}

	function closeSupplierModal() {
		currentSupplier = null;
		supplierOffcanvasInstance?.hide();
	}

	// -----------------------------
	// 🔐 LOGOUT
	// -----------------------------
	function logout() {
		sessionStorage.removeItem("adminLoggedIn");
		sessionStorage.removeItem("adminUser");
		goto("/admin-panel-2025", { replaceState: true });
	}
</script>

<svelte:head>
	<title>Panel Administrativo — Urban Empire</title>
</svelte:head>

<div class="min-vh-100 bg-light">
	<header class="bg-dark text-white py-3 shadow-sm">
		<div
			class="container d-flex justify-content-between align-items-center"
		>
			<h1 class="h4 mb-0">Panel Administrativo</h1>

			<div class="d-flex align-items-center gap-3">
				<small class="text-white-50">{adminUser}</small>

				<button class="btn btn-outline-light btn-sm" on:click={logout}>
					Cerrar sesión
				</button>
			</div>
		</div>
	</header>

	<main class="py-4">
		<div class="container">
			<TabsNavigation bind:activeTab {productos} {proveedores} />

			{#if activeTab === "productos"}
				<ProductsSection
					{productos}
					loading={loadingProducts}
					openEditProductModal={openProductModal}
					onDelete={handleDeleteProduct}
				/>
			{:else}
				<SuppliersSection
					{proveedores}
					loading={loadingSuppliers}
					openCreateSupplierModal={() => openSupplierModal()}
					openEditSupplierModal={openSupplierModal}
					onDelete={handleDeleteSupplier}
				/>
			{/if}
		</div>
	</main>
</div>

<!-- Offcanvas Productos -->
<div
	bind:this={productOffcanvasElement}
	class="offcanvas offcanvas-end"
	style="--bs-offcanvas-width: 500px"
	tabindex="-1"
	id="productOffcanvas"
>
	<ProductForm
		product={currentProduct || {}}
		isEditing={!!currentProduct}
		onSave={handleSaveProduct}
		onClose={closeProductModal}
	/>
</div>

<!-- Offcanvas Proveedores -->
<div
	bind:this={supplierOffcanvasElement}
	class="offcanvas offcanvas-end"
	style="--bs-offcanvas-width: 500px"
	tabindex="-1"
	id="supplierOffcanvas"
>
	<SupplierForm
		supplier={currentSupplier || {}}
		isEditing={!!currentSupplier}
		onSave={handleSaveSupplier}
		onClose={closeSupplierModal}
	/>
</div>
