import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import Cart from './pages/Cart/Cart';
import Favorites from './pages/Favorites/Favorites';
import UserSearch from './pages/UserSearch/UserSearch';
import './App.css';

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Проверяем авторизацию при загрузке приложения
    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(auth);
    }, []);

    // Функция для обновления состояния авторизации
    const updateAuthStatus = (status) => {
        setIsAuthenticated(status);
    };

    // Функция для выхода
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="App">
                <Header
                    cartItemsCount={cartItems.length}
                    favoriteItemsCount={favoriteItems.length}
                    isAuthenticated={isAuthenticated}
                    onLogout={handleLogout}
                />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/catalog"
                            element={
                                <Catalog
                                    cartItems={cartItems}
                                    setCartItems={setCartItems}
                                    favoriteItems={favoriteItems}
                                    setFavoriteItems={setFavoriteItems}
                                />
                            }
                        />
                        <Route 
                            path="/profile" 
                            element={
                                <Profile 
                                    updateAuthStatus={updateAuthStatus}
                                />
                            } 
                        />
                        <Route 
                            path="/register" 
                            element={
                                <Register 
                                    updateAuthStatus={updateAuthStatus}
                                />
                            } 
                        />
                        <Route
                            path="/user-search"
                            element={<UserSearch />}
                        />
                        <Route
                            path="/cart"
                            element={
                                <Cart
                                    cartItems={cartItems}
                                    setCartItems={setCartItems}
                                />
                            }
                        />
                        <Route
                            path="/favorites"
                            element={
                                <Favorites
                                    favoriteItems={favoriteItems}
                                    setFavoriteItems={setFavoriteItems}
                                    cartItems={cartItems}
                                    setCartItems={setCartItems}
                                />
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;