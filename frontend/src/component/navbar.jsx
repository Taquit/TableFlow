function Navbar() {
    return (
        <nav className="navbar">
            <div className="container">
                <a href="#" className="logo-container">
                    <span className="logo-icon">TF</span>
                    <span className="logo-text">TableFlow</span>
                </a>
                <ul className="nav-links">
                    <li><a href="#tables">Mesas</a></li>
                    <li><a href="#guests">Invitados</a></li>
                    <li><a href="#payments">Pagos</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;