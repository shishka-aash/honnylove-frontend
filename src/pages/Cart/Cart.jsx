import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems, setCartItems }) => {
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const applyPromo = () => {
        if (promoCode === 'HONNY10') {
            setPromoApplied(true);
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    if (cartItems.length === 0) {
        return (
            <div className="cart">
                <div className="container">
                    <h1 className="page-title">Корзина</h1>
                    <div className="empty-cart">
                        <div className="empty-icon">🛒</div>
                        <h2>Ваша корзина пуста</h2>
                        <p>Добавьте товары из каталога, чтобы сделать заказ</p>
                        <Link to="/catalog" className="cta-button">
                            Перейти в каталог
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart">
            <div className="container">
                <h1 className="page-title">Корзина</h1>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-info">
                                    <h3 className="item-name">{item.name}</h3>
                                    <p className="item-price">{item.price} ₽</p>
                                </div>
                                <div className="item-quantity">
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="item-total">
                                    {item.price * item.quantity} ₽
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeItem(item.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="summary-card">
                            <h3>Итого</h3>

                            <div className="summary-row">
                                <span>
                                    Товары (
                                    {cartItems.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                    )}
                                    )
                                </span>
                                <span>{subtotal} ₽</span>
                            </div>

                            {promoApplied && (
                                <div className="summary-row discount">
                                    <span>Скидка 10%</span>
                                    <span>-{discount} ₽</span>
                                </div>
                            )}

                            <div className="promo-section">
                                <input
                                    type="text"
                                    placeholder="Промокод"
                                    value={promoCode}
                                    onChange={(e) =>
                                        setPromoCode(e.target.value)
                                    }
                                    disabled={promoApplied}
                                />
                                <button
                                    onClick={applyPromo}
                                    disabled={promoApplied || !promoCode}
                                >
                                    {promoApplied ? 'Применен' : 'Применить'}
                                </button>
                            </div>

                            <div className="summary-row total">
                                <span>Общая сумма</span>
                                <span>{total} ₽</span>
                            </div>

                            <button className="checkout-btn">
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
