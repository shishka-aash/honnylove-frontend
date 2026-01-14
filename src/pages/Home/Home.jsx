import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: 'Добро пожаловать в мир honnyluv',
            subtitle: 'Откройте для себя магию корейской косметики',
            image: '/src/assets/7d0d9d763aa3f3abf8b5fe9d9a3baedd.jpg',
            buttonText: 'Исследовать коллекцию',
            buttonLink: '/catalog',
            theme: 'pink',
        },
        {
            id: 2,
            title: 'Новая коллекция COSRX',
            subtitle: 'Инновационные средства для идеальной кожи',
            image: '/src/assets/cosrx_acne_pimple12.png',
            buttonText: 'Смотреть новинки',
            buttonLink: '/catalog?new=true',
            theme: 'pink',
        },
        {
            id: 3,
            title: 'Скидка 20% на первый заказ',
            subtitle: 'Успейте получить выгоду на весь ассортимент',
            image: '/src/assets/1234.png',
            buttonText: 'Воспользоваться скидкой',
            buttonLink: '/catalog?discount=true',
            theme: 'pink',
        },
        {
            id: 4,
            title: 'Бесплатная доставка от 3000₽',
            subtitle: 'Быстрая доставка по всей России',
            image: '/src/assets/456.png',
            buttonText: 'Выбрать товары',
            buttonLink: '/catalog',
            theme: 'pink',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Смена слайда каждые 5 секунд

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="home">
            {/* Секция слайдера */}
            <section className="hero-slider">
                <div className="slider-container">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`slide ${
                                index === currentSlide ? 'active' : ''
                            } ${slide.theme}`}
                            style={{
                                backgroundImage: `url(${slide.image})`,
                                transform: `translateX(-${
                                    currentSlide * 100
                                }%)`,
                            }}
                        >
                            <div className="slide-overlay"></div>
                            <div className="container">
                                <div className="slide-content">
                                    <h1 className="slide-title">
                                        {slide.title}
                                    </h1>
                                    <p className="slide-subtitle">
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        to={slide.buttonLink}
                                        className="cta-button"
                                    >
                                        {slide.buttonText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Кнопки навигации */}
                <button className="slider-nav prev" onClick={prevSlide}>
                    ‹
                </button>
                <button className="slider-nav next" onClick={nextSlide}>
                    ›
                </button>

                {/* Индикаторы слайдов */}
                <div className="slider-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${
                                index === currentSlide ? 'active' : ''
                            }`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Остальные секции остаются без изменений */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Почему K-Beauty?</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <div className="feature-icon">✨</div>
                            <h3>Инновационные формулы</h3>
                            <p>
                                Передовые технологии и натуральные ингредиенты
                            </p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">🌿</div>
                            <h3>Натуральные компоненты</h3>
                            <p>Только безопасные и эффективные составы</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">💝</div>
                            <h3>Для молодой кожи</h3>
                            <p>Специально для девушек 15-25 лет</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Секция с продукцией */}
            <section className="products-showcase">
                <div className="container">
                    <h2 className="section-title">Наша продукция</h2>
                    <div className="products-grid">
                        <div className="product-item">
                            <img
                                src="/src/assets/image1.png"
                                alt="Корейская косметика 1"
                                className="product-image"
                            />
                            <div className="product-overlay">
                                <h3>Уходовая косметика</h3>
                                <p>Нежные средства для ежедневного ухода</p>
                            </div>
                        </div>
                        <div className="product-item">
                            <img
                                src="/src/assets/image.png"
                                alt="Корейская косметика 2"
                                className="product-image"
                            />
                            <div className="product-overlay">
                                <h3>Декоративная косметика</h3>
                                <p>Стильные и модные продукты</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="brands">
                <div className="container">
                    <h2 className="section-title">Популярные бренды</h2>
                    <div className="brands-grid">
                        <div className="brand">COSRX</div>
                        <div className="brand">LANEIGE</div>
                        <div className="brand">INNISFREE</div>
                        <div className="brand">ETUDE</div>
                        <div className="brand">MISSHA</div>
                        <div className="brand">THE FACE SHOP</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
