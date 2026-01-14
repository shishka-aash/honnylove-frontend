import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import './Favorites.css';

const Favorites = ({
    favoriteItems,
    setFavoriteItems,
    cartItems,
    setCartItems,
}) => {
    const removeFromFavorites = (product) => {
        setFavoriteItems(
            favoriteItems.filter((item) => item.id !== product.id)
        );
    };

    const addToCart = (product) => {
        if (!cartItems.find((item) => item.id === product.id)) {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const isInCart = (product) => {
        return cartItems.some((item) => item.id === product.id);
    };

    if (favoriteItems.length === 0) {
        return (
            <div className="favorites">
                <div className="container">
                    <h1 className="page-title">Избранное</h1>
                    <div className="empty-favorites">
                        <div className="empty-icon">❤️</div>
                        <h2>В избранном пока пусто</h2>
                        <p>Добавляйте товары в избранное, чтобы не потерять</p>
                        <Link to="/catalog" className="cta-button">
                            Перейти в каталог
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites">
            <div className="container">
                <h1 className="page-title">Избранное</h1>
                <p className="favorites-subtitle">
                    Товары, которые вам понравились
                </p>

                <div className="favorites-grid">
                    {favoriteItems.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                            onToggleFavorite={removeFromFavorites}
                            isInCart={isInCart(product)}
                            isInFavorites={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favorites;
