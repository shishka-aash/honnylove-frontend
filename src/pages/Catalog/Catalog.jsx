import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Catalog.css';

const Catalog = ({
    cartItems,
    setCartItems,
    favoriteItems,
    setFavoriteItems,
}) => {
    // Состояния для хранения данных
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для загрузки товаров из API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('http://localhost:9999/api/products/getall');
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Проверяем успешность ответа от сервера
            if (data.success) {
                // Преобразуем данные из API в формат, ожидаемый вашим приложением
                const formattedProducts = data.data.products.map(product => ({
                    id: product.product_id,
                    name: product.name,
                    price: parseFloat(product.price), // Преобразуем строку в число
                    image: product.image_url,
                    description: product.description,
                    category: product.category,
                    stock_quantity: product.stock_quantity,
                    // Дополнительные поля, которые могут быть полезны
                    originalProduct: product // Сохраняем оригинальные данные, если понадобятся
                }));
                
                setProducts(formattedProducts);
            } else {
                throw new Error(data.message || 'Ошибка при получении товаров');
            }
        } catch (err) {
            console.error('Ошибка при загрузке товаров:', err);
            setError(err.message);
            
            // Для демонстрации можно оставить моковые данные при ошибке
            // setProducts(mockProducts); // Раскомментировать если нужны заглушки
        } finally {
            setLoading(false);
        }
    };

    // Загружаем товары при монтировании компонента
    useEffect(() => {
        fetchProducts();
    }, []);

    // Функция для добавления в корзину
    const addToCart = (product) => {
        if (!cartItems.find((item) => item.id === product.id)) {
            setCartItems([...cartItems, { 
                ...product, 
                quantity: 1 
            }]);
        }
    };

    // Функция для добавления/удаления из избранного
    const toggleFavorite = (product) => {
        if (favoriteItems.find((item) => item.id === product.id)) {
            setFavoriteItems(
                favoriteItems.filter((item) => item.id !== product.id)
            );
        } else {
            setFavoriteItems([...favoriteItems, product]);
        }
    };

    // Проверка наличия товара в корзине
    const isInCart = (product) => {
        return cartItems.some((item) => item.id === product.id);
    };

    // Проверка наличия товара в избранном
    const isInFavorites = (product) => {
        return favoriteItems.some((item) => item.id === product.id);
    };

    // Если данные загружаются
    if (loading) {
        return (
            <div className="catalog">
                <div className="container">
                    <h1 className="page-title">Honnyluvv Каталог</h1>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Загружаем товары...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Если произошла ошибка
    if (error) {
        return (
            <div className="catalog">
                <div className="container">
                    <h1 className="page-title">Honnyluvv Каталог</h1>
                    <div className="error-container">
                        <p className="error-message">Ошибка: {error}</p>
                        <button 
                            className="retry-button"
                            onClick={fetchProducts}
                        >
                            Попробовать снова
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Если товаров нет
    if (products.length === 0) {
        return (
            <div className="catalog">
                <div className="container">
                    <h1 className="page-title">Honnyluvv Каталог</h1>
                    <div className="empty-catalog">
                        <p>Товары временно отсутствуют</p>
                    </div>
                </div>
            </div>
        );
    }

    // Основной рендеринг каталога
    return (
        <div className="catalog">
            <div className="container">
                <h1 className="page-title">Honnyluvv Каталог</h1>
                <p className="catalog-subtitle">
                    Откройте для себя магию корейской косметики с популярными средствами
                </p>
                
                {/* Можно добавить фильтры или поиск позже */}
                {/* <div className="catalog-controls">
                    <input type="text" placeholder="Поиск товаров..." />
                    <select>
                        <option value="">Все категории</option>
                        <option value="Тоники">Тоники</option>
                        <option value="Сыворотки">Сыворотки</option>
                        <option value="Кремы">Кремы</option>
                    </select>
                </div> */}

                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                            onToggleFavorite={toggleFavorite}
                            isInCart={isInCart(product)}
                            isInFavorites={isInFavorites(product)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Catalog;