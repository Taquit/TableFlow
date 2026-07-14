import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-header">
                    <Link to="/" className="logo-container">
                        <span className="logo-icon">TF</span>
                        <span className="logo-text">TableFlow</span>
                    </Link>
                    <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
                        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
                <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={toggleMenu}>Inicio</Link></li>
                    <li><Link to="/event" onClick={toggleMenu}>Gestión Eventos</Link></li>
                    <li><Link to="/tables" onClick={toggleMenu}>Gestión Mesas</Link></li>
                    <li><Link to="/guests" onClick={toggleMenu}>Gestión Invitados</Link></li>
                    <li><Link to="/accounting" onClick={toggleMenu}>Contaduría</Link></li>
                    <li><Link to="/export" onClick={toggleMenu}>Exportar</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;