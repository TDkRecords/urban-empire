<script>
	import { db } from "$lib/assets/js/firebase.js";
	import { collection, query, where, getDocs } from "firebase/firestore";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import 'bootstrap/dist/css/bootstrap.min.css';

	let username = "";
	let password = "";
	let error = "";
	let loading = false;

	onMount(() => {
		// Check if already logged in
		const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
		if (isLoggedIn === "true") {
			goto("/admin-panel-2025/dashboard");
		}
	});

	async function handleLogin() {
		error = "";
		loading = true;

		try {
			// Query the administradores collection
			const adminRef = collection(db, "administradores");
			const q = query(
				adminRef,
				where("usuario", "==", username),
				where("contraseña", "==", password),
			);

			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				// Login successful
				sessionStorage.setItem("adminLoggedIn", "true");
				sessionStorage.setItem("adminUser", username);
				goto("/admin-panel-2025/dashboard");
			} else {
				error = "Usuario o contraseña incorrectos";
			}
		} catch (err) {
			console.error("Error al iniciar sesión:", err);
			error = "Error al iniciar sesión. Por favor, intenta de nuevo.";
		} finally {
			loading = false;
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		handleLogin();
	}
</script>

<svelte:head>
	<title>Admin Login - Urban Empire</title>
</svelte:head>

<div class="login-container">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-5 col-lg-4">
				<div class="card shadow-lg border-0 login-card">
					<div class="card-body p-5">
						<h1 class="text-center mb-2">Panel Administrativo</h1>
						<p class="text-center text-muted mb-4">Urban Empire</p>

						<form on:submit={handleSubmit}>
							<div class="mb-3">
								<label for="username" class="form-label">Usuario</label>
								<input
									type="text"
									id="username"
									class="form-control"
									bind:value={username}
									required
									disabled={loading}
									placeholder="Ingresa tu usuario"
								/>
							</div>

							<div class="mb-3">
								<label for="password" class="form-label">Contraseña</label>
								<input
									type="password"
									id="password"
									class="form-control"
									bind:value={password}
									required
									disabled={loading}
									placeholder="Ingresa tu contraseña"
								/>
							</div>

							{#if error}
								<div class="alert alert-danger" role="alert">
									{error}
								</div>
							{/if}

							<button type="submit" disabled={loading} class="btn btn-primary w-100 login-btn">
								{loading ? "Iniciando sesión..." : "Iniciar Sesión"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20px;
	}

	.login-card {
		border-radius: 12px;
	}

	h1 {
		font-size: 28px;
		color: #333;
	}

	.login-btn {
		padding: 14px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border: none;
		font-size: 16px;
		font-weight: 600;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.login-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.login-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
