import { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({
    product,
    onAddToCart,
    onToggleFavorite,
    isInCart,
    isInFavorites,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="product-card slide-in">
            <div className="product-image">
                <img
                    src={product.image}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    className={imageLoaded ? 'loaded' : ''}
                />
                <div className="product-actions">
                    <button
                        className={`favorite-btn ${
                            isInFavorites ? 'active' : ''
                        }`}
                        onClick={() => onToggleFavorite(product)}
                    >
                        ♥
                    </button>
                    <button
                        className={`cart-btn ${isInCart ? 'active' : ''}`}
                        onClick={() => onAddToCart(product)}
                    >
                        {isInCart ? '✓' : '+'}
                    </button>
                </div>
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price} ₽</p>
            </div>
        </div>
    );
};

export default ProductCard;
