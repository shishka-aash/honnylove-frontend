import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Honnyluvv</h3>
                        <p>
                            Магазин корейской косметики для молодой и сияющей
                            кожи
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Категории</h4>
                        <ul>
                            <li>
                                <a href="/catalog">Уход за кожей</a>
                            </li>
                            <li>
                                <a href="/catalog">Декоративная косметика</a>
                            </li>
                            <li>
                                <a href="/catalog">Маски для лица</a>
                            </li>
                            <li>
                                <a href="/catalog">Сыворотки</a>
                            </li>
                            <li>
                                <a href="/catalog">Наборы</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Помощь</h4>
                        <ul>
                            <li>
                                <a href="#">Доставка и оплата</a>
                            </li>
                            <li>
                                <a href="#">Возврат</a>
                            </li>
                            <li>
                                <a href="#">Консультация</a>
                            </li>
                            <li>
                                <a href="#">Уход за кожей</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Контакты</h4>
                        <p>Email: beauty@honnyluvv.com</p>
                        <p>Телефон: +7 (999) 123-45-67</p>
                        <div className="social-links">
                            <a href="#">Instagram</a>
                            <a href="#">Telegram</a>
                            <a href="#">VK</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 Honnyluvv K-Beauty. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
