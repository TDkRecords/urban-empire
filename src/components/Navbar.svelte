<script>
    import "../app.css";
</script>

<nav class="navbar navbar-expand-lg bg-dark sticky-top">
    <div class="container-fluid">
        <a class="navbar-brand text-info" href="/">URBAN EMPIRE</a>
        <button
            class="navbar-toggler bg-info"
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
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="/">
                        Home <i class="fa-solid fa-house"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/productos">
                        Productos <i class="fa-solid fa-bag-shopping"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/about">
                        Acerca de <i class="fa-solid fa-circle-info"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/contacto">
                        Contacto <i class="fa-solid fa-user-tie"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<style>
    .navbar .nav-link {
        position: relative;
        color: #00ccff;
        text-decoration: none;
        transition: color 125ms ease-out;
    }

    .navbar .nav-link::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #00ccff;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 300ms ease-out;
    }

    .navbar .nav-link:hover {
        color: whitesmoke;
    }

    .navbar .nav-link:hover::after {
        transform: scaleX(1);
    }

    .navbar .navbar-brand {
        position: relative;
        transition: color 125ms ease-out;
    }
    .navbar .navbar-brand::after {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #00ccff;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 300ms ease-out;
    }
    .navbar .navbar-brand:hover {
        color: whitesmoke;
    }
    .navbar .navbar-brand:hover::after {
        transform: scaleX(1);
    }
</style>
