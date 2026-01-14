import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({ updateAuthStatus }) => {
    const navigate = useNavigate();
    
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [orders] = useState([
        {
            id: 1,
            date: '15.12.2023',
            total: 5498,
            status: 'Доставлен',
            items: 2,
        },
        {
            id: 2,
            date: '10.12.2023',
            total: 899,
            status: 'Доставлен',
            items: 1,
        },
        {
            id: 3,
            date: '05.12.2023',
            total: 4599,
            status: 'В обработке',
            items: 1,
        },
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...user });
    const [loading, setLoading] = useState(true);

    // Проверяем авторизацию при загрузке компонента
    useEffect(() => {
        const checkAuth = () => {
            const userData = localStorage.getItem('user');
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

            if (!isAuthenticated || !userData) {
                // Если пользователь не авторизован, перенаправляем на регистрацию
                navigate('/register');
                return;
            }

            const parsedUser = JSON.parse(userData);
            
            // Форматируем данные для отображения
            setUser({
                name: `${parsedUser.firstName || ''} ${parsedUser.lastName || ''}`.trim(),
                email: parsedUser.email || '',
                phone: '', // Эти данные можно получать с сервера
                address: '', // Эти данные можно получать с сервера
                ...parsedUser
            });
            
            setEditData({
                name: `${parsedUser.firstName || ''} ${parsedUser.lastName || ''}`.trim(),
                email: parsedUser.email || '',
                phone: '',
                address: '',
                ...parsedUser
            });
            
            setLoading(false);
        };

        checkAuth();
    }, [navigate]);

    const handleSave = () => {
        // Здесь будет логика обновления данных на сервере
        setUser(editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(user);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        updateAuthStatus(false);
        navigate('/');
    };

    if (loading) {
        return (
            <div className="profile">
                <div className="container">
                    <h1 className="page-title">Мой профиль</h1>
                    <div className="profile-content">
                        <p>Загрузка...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile">
            <div className="container">
                <h1 className="page-title">Мой профиль</h1>

                <div className="profile-content">
                    <div className="profile-info">
                        <h2>Личная информация</h2>
                        {!isEditing ? (
                            <div className="info-card">
                                <div className="info-item">
                                    <span className="label">Имя:</span>
                                    <span className="value">{user.name || 'Не указано'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Email:</span>
                                    <span className="value">{user.email || 'Не указан'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Телефон:</span>
                                    <span className="value">{user.phone || 'Не указан'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Адрес:</span>
                                    <span className="value">
                                        {user.address || 'Не указан'}
                                    </span>
                                </div>
                                <div className="profile-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="logout-btn"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="info-card">
                                <div className="input-group">
                                    <label>Имя:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Телефон:</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Адрес:</label>
                                    <textarea
                                        name="address"
                                        value={editData.address}
                                        onChange={handleChange}
                                        rows="3"
                                    />
                                </div>
                                <div className="edit-actions">
                                    <button
                                        className="save-btn"
                                        onClick={handleSave}
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={handleCancel}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-orders">
                        <h2>История заказов</h2>
                        {orders.length === 0 ? (
                            <p>У вас пока нет заказов</p>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <span className="order-id">
                                                Заказ #{order.id}
                                            </span>
                                            <span className="order-date">
                                                {order.date}
                                            </span>
                                        </div>
                                        <div className="order-details">
                                            <span className="order-items">
                                                {order.items} товар(а)
                                            </span>
                                            <span className="order-total">
                                                {order.total} ₽
                                            </span>
                                            <span
                                                className={`order-status ${order.status.toLowerCase()}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;