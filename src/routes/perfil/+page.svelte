<script>
	import { user, userProfile } from "$lib/stores/authStore.js";
	import { db } from "$lib/assets/js/firebase.js";
	import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
	import "bootstrap/dist/css/bootstrap.min.css";

	let loading = true;
	let saving = false;
	let editMode = false;
	let hasProfile = false;

	// Datos del formulario
	let formData = {
		nombre: "",
		apellido: "",
		edad: "",
		direccion: "",
		codigoPostal: "",
	};

	// Datos originales para comparar cambios
	let originalData = {};

	onMount(async () => {
		if (!browser) return;

		// Verificar si el usuario está autenticado
		const unsubscribe = user.subscribe(async (currentUser) => {
			if (!currentUser) {
				goto("/");
				return;
			}

			// Cargar perfil del usuario desde Firestore
			await loadUserProfile(currentUser.uid);
		});

		return unsubscribe;
	});

	async function loadUserProfile(uid) {
		loading = true;
		try {
			const userDoc = await getDoc(doc(db, "usuarios", uid));

			if (userDoc.exists()) {
				const data = userDoc.data();
				formData = {
					nombre: data.nombre || "",
					apellido: data.apellido || "",
					edad: data.edad || "",
					direccion: data.direccion || "",
					codigoPostal: data.codigoPostal || "",
				};
				originalData = { ...formData };
				hasProfile = true;
				editMode = false;
			} else {
				// No tiene perfil, mostrar formulario vacío
				hasProfile = false;
				editMode = true;
			}
		} catch (error) {
			console.error("Error al cargar perfil:", error);
		} finally {
			loading = false;
		}
	}

	async function handleSubmit() {
		if (!$user) return;

		// Validar campos obligatorios
		if (
			!formData.nombre ||
			!formData.apellido ||
			!formData.edad ||
			!formData.direccion
		) {
			alert("Por favor, completa todos los campos obligatorios");
			return;
		}

		saving = true;
		try {
			const userData = {
				nombre: formData.nombre,
				apellido: formData.apellido,
				edad: parseInt(formData.edad),
				direccion: formData.direccion,
				codigoPostal: formData.codigoPostal || "",
				email: $user.email,
				photoURL: $user.photoURL,
				displayName: $user.displayName,
				updatedAt: new Date().toISOString(),
			};

			if (hasProfile) {
				// Actualizar perfil existente
				await updateDoc(doc(db, "usuarios", $user.uid), userData);
				alert("Perfil actualizado exitosamente");
			} else {
				// Crear nuevo perfil
				userData.createdAt = new Date().toISOString();
				await setDoc(doc(db, "usuarios", $user.uid), userData);
				alert("Perfil creado exitosamente");
				hasProfile = true;
			}

			originalData = { ...formData };
			editMode = false;
			userProfile.set(userData);
		} catch (error) {
			console.error("Error al guardar perfil:", error);
			alert("Error al guardar el perfil");
		} finally {
			saving = false;
		}
	}

	function handleEdit() {
		editMode = true;
	}

	function handleCancel() {
		if (hasProfile) {
			formData = { ...originalData };
			editMode = false;
		} else {
			goto("/");
		}
	}
</script>

<svelte:head>
	<title>Mi Perfil - Urban Empire</title>
</svelte:head>

<div class="profile-page">
	<div class="container py-5">
		{#if loading}
			<div class="text-center py-5">
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Cargando...</span>
				</div>
				<p class="mt-3 text-muted">Cargando perfil...</p>
			</div>
		{:else}
			<div class="row justify-content-center">
				<div class="col-lg-8">
					<div class="card shadow-sm">
						<div class="card-header bg-gradient text-white">
							<div
								class="d-flex align-items-center justify-content-between"
							>
								<div class="d-flex align-items-center gap-3">
									{#if $user?.photoURL}
										<img
											src={$user.photoURL}
											alt={$user.displayName}
											class="profile-avatar"
										/>
									{/if}
									<div>
										<h4 class="mb-0 text-black">
											{hasProfile
												? "Mi Perfil"
												: "Completa tu Perfil"}
										</h4>
										<small class="opacity-75 text-dark"
											>{$user?.email}</small
										>
									</div>
								</div>
								{#if hasProfile && !editMode}
									<button
										class="btn btn-light btn-sm"
										on:click={handleEdit}
									>
										<i class="fa-solid fa-pen"></i> Editar
									</button>
								{/if}
							</div>
						</div>

						<div class="card-body p-4">
							{#if !hasProfile}
								<div class="alert alert-info mb-4">
									<i class="fa-solid fa-circle-info"></i>
									Por favor, completa tu información de perfil
									para continuar.
								</div>
							{/if}

							<form on:submit|preventDefault={handleSubmit}>
								<div class="row g-3">
									<div class="col-md-6">
										<label for="nombre" class="form-label">
											Nombre <span class="text-danger"
												>*</span
											>
										</label>
										<input
											type="text"
											class="form-control"
											id="nombre"
											bind:value={formData.nombre}
											disabled={!editMode}
											required
										/>
									</div>

									<div class="col-md-6">
										<label
											for="apellido"
											class="form-label"
										>
											Apellido <span class="text-danger"
												>*</span
											>
										</label>
										<input
											type="text"
											class="form-control"
											id="apellido"
											bind:value={formData.apellido}
											disabled={!editMode}
											required
										/>
									</div>

									<div class="col-md-6">
										<label for="edad" class="form-label">
											Edad <span class="text-danger"
												>*</span
											>
										</label>
										<input
											type="number"
											class="form-control"
											id="edad"
											bind:value={formData.edad}
											disabled={!editMode}
											min="1"
											max="120"
											required
										/>
									</div>

									<div class="col-md-6">
										<label
											for="codigoPostal"
											class="form-label"
										>
											Código Postal <span
												class="text-muted"
												>(opcional)</span
											>
										</label>
										<input
											type="text"
											class="form-control"
											id="codigoPostal"
											bind:value={formData.codigoPostal}
											disabled={!editMode}
										/>
									</div>

									<div class="col-12">
										<label
											for="direccion"
											class="form-label"
										>
											Dirección <span class="text-danger"
												>*</span
											>
										</label>
										<textarea
											class="form-control"
											id="direccion"
											bind:value={formData.direccion}
											disabled={!editMode}
											rows="3"
											required
										></textarea>
									</div>
								</div>

								{#if editMode}
									<div
										class="d-flex gap-2 justify-content-end mt-4"
									>
										<button
											type="button"
											class="btn btn-outline-secondary"
											on:click={handleCancel}
											disabled={saving}
										>
											Cancelar
										</button>
										<button
											type="submit"
											class="btn btn-custom-primary"
											disabled={saving}
										>
											{#if saving}
												<span
													class="spinner-border spinner-border-sm me-2"
													role="status"
												></span>
												Guardando...
											{:else}
												<i class="fa-solid fa-save me-2"
												></i>
												{hasProfile
													? "Actualizar Perfil"
													: "Guardar Perfil"}
											{/if}
										</button>
									</div>
								{/if}
							</form>
						</div>
					</div>

					{#if hasProfile && !editMode}
						<div class="card shadow-sm mt-4">
							<div class="card-body">
								<h5 class="card-title mb-3">
									<i class="fa-solid fa-info-circle"></i> Información
									de la Cuenta
								</h5>
								<div class="row g-3">
									<div class="col-md-6">
										<small class="text-muted d-block"
											>Nombre completo</small
										>
										<strong
											>{formData.nombre}
											{formData.apellido}</strong
										>
									</div>
									<div class="col-md-6">
										<small class="text-muted d-block"
											>Correo electrónico</small
										>
										<strong>{$user?.email}</strong>
									</div>
									<div class="col-md-6">
										<small class="text-muted d-block"
											>Edad</small
										>
										<strong>{formData.edad} años</strong>
									</div>
									{#if formData.codigoPostal}
										<div class="col-md-6">
											<small class="text-muted d-block"
												>Código Postal</small
											>
											<strong
												>{formData.codigoPostal}</strong
											>
										</div>
									{/if}
									<div class="col-12">
										<small class="text-muted d-block"
											>Dirección</small
										>
										<strong>{formData.direccion}</strong>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.profile-page {
		min-height: calc(100vh - 80px);
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	}

	.bg-gradient {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.profile-avatar {
		background-color: black;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 3px solid white;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.btn-custom-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.btn-custom-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
		color: white;
	}

	.btn-custom-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.card {
		border: none;
		border-radius: 12px;
		overflow: hidden;
	}

	.card-header {
		border-bottom: none;
		padding: 1.5rem;
	}

	.form-control:disabled {
		background-color: #f8f9fa;
		cursor: not-allowed;
	}
</style>
