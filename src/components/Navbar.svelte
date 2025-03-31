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
                        Home
                        <i class="fa-solid fa-house"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/">
                        Productos
                        <i class="fa-solid fa-bag-shopping"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/">
                        Acerca de
                        <i class="fa-solid fa-circle-info"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/contacto">
                        Contacto
                        <i class="fa-solid fa-user-tie"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<style>
    a {
        color: #00ccff;
        transition: color 125ms ease-out;
    }
    a:hover {
        text-decoration: underline;
        color: whitesmoke;
    }
</style>
