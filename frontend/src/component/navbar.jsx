import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo-container">
                    <span className="logo-icon">TF</span>
                    <span className="logo-text">TableFlow</span>
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/">Gestión Eventos</Link></li>
                    <li><Link to="/tables">Gestión Mesas</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;