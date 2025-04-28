<script>
    import "../app.css";
</script>

<nav class="navbar navbar-expand-lg purple-700 sticky-top">
    <div class="container-fluid">
        <a class="navbar-brand text-light fw-bold" href="/"> URBAN EMPIRE </a>
        <button
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link text-light" aria-current="page" href="/">
                        Inicio <i class="fa-solid fa-house"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-light" href="/productos">
                        Productos <i class="fa-solid fa-bag-shopping"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-light" href="/about">
                        Acerca de <i class="fa-solid fa-circle-info"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-light" href="/contacto">
                        Contacto <i class="fa-solid fa-user-tie"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<style>
    .navbar {
        padding: 1rem 2rem;
        box-shadow: 0 2px 15px rgba(46, 8, 84, 0.08);
    }

    .navbar-brand {
        font-size: clamp(1.4rem, 1vw, 3rem);
        letter-spacing: -0.5px;
    }

    .nav-link {
        position: relative;
        margin: 0 1rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .nav-link i {
        color: #ffffff;
        margin-left: 0.3rem;
        transition: inherit;
    }

    .nav-link:hover {
        color: #f8c555 !important;
    }

    .nav-link:hover i {
        color: #f8c555;
    }

    .navbar-toggler-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%231F1A2E' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }

    .navbar-toggler:focus {
        box-shadow: 0 0 0 2px rgba(248, 197, 85, 0.5);
    }
</style>
