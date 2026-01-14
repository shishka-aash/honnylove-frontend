import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import './Header.css';

const Header = ({ cartItemsCount, favoriteItemsCount, isAuthenticated, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <img
                            src={logo}
                            alt="Honnyluvv"
                            className="logo-image"
                        />
                        <span className="logo-text">Honnyluvv</span>
                    </Link>

                    <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                        <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            Главная
                        </Link>
                        <Link to="/catalog" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            Каталог
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                    Профиль
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="nav-link logout-btn"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                Войти / Регистрация
                            </Link>
                        )}
                        
                        <Link to="/user-search" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            Поиск пользователей
                        </Link>
                        <Link to="/favorites" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            Избранное
                            {favoriteItemsCount > 0 && (
                                <span className="badge">
                                    {favoriteItemsCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            Корзина
                            {cartItemsCount > 0 && (
                                <span className="badge">{cartItemsCount}</span>
                            )}
                        </Link>
                    </nav>

                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;