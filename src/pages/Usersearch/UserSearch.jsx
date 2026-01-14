// src/pages/UserSearch/UserSearch.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserSearch.css';

const UserSearch = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    
    // Примеры пользователей для тестирования (можно удалить или заменить на реальные данные)
    const [exampleUsers] = useState([
        'anna_smith',
        'john_doe',
        'alex_jones',
        'maria_garcia'
    ]);

    // Загружаем историю поиска из localStorage при монтировании
    useEffect(() => {
        const savedHistory = localStorage.getItem('userSearchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Сохраняем историю поиска в localStorage
    const saveToHistory = (searchedUsername) => {
        const updatedHistory = [
            searchedUsername,
            ...searchHistory.filter(item => item !== searchedUsername)
        ].slice(0, 10); // Храним только последние 10 запросов
        
        setSearchHistory(updatedHistory);
        localStorage.setItem('userSearchHistory', JSON.stringify(updatedHistory));
    };

    const handleSearch = async (searchUsername = null) => {
        const userToSearch = searchUsername || username.trim();
        
        if (!userToSearch) {
            setError('Введите имя пользователя');
            return;
        }

        setLoading(true);
        setError('');
        setUserData(null);
        setDebugInfo('');
        
        // Обновляем поле ввода если поиск вызван из другого места
        if (searchUsername) {
            setUsername(searchUsername);
        }

        try {
            console.log('🔍 Начинаем поиск пользователя:', userToSearch);
            
            // Используем предоставленный вами API эндпоинт
            const response = await axios.get(
                `http://localhost:9999/api/user/${userToSearch}`,
                {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log('✅ Ответ от сервера:', response.data);

            // Проверяем структуру ответа
            if (response.data.success && response.data.data) {
                const userData = response.data.data;
                
                // Преобразуем данные из snake_case в camelCase если нужно
                const formattedUserData = {
                    userId: userData.userId,
                    username: userData.username,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt
                };
                
                setUserData(formattedUserData);
                setDebugInfo(`Пользователь "${userData.username}" найден успешно`);
                
                // Сохраняем в историю
                saveToHistory(userToSearch);
            } else {
                setError('Не удалось получить данные пользователя');
                setDebugInfo('Сервер вернул некорректный формат данных');
            }
            
        } catch (err) {
            console.error('❌ Ошибка при поиске:', err);
            
            // Определяем тип ошибки
            if (err.code === 'ECONNREFUSED') {
                setError('Сервер недоступен');
                setDebugInfo('Проверьте, запущен ли бэкенд на порту 9999');
            } else if (err.response) {
                // Сервер ответил с ошибкой
                const status = err.response.status;
                
                switch (status) {
                    case 404:
                        setError(`Пользователь "${userToSearch}" не найден`);
                        setDebugInfo('Проверьте правильность ввода имени пользователя');
                        break;
                    case 400:
                        setError('Некорректный запрос');
                        setDebugInfo(err.response.data?.message || 'Проверьте параметры запроса');
                        break;
                    case 401:
                        setError('Требуется авторизация');
                        setDebugInfo('Возможно, нужен токен доступа');
                        break;
                    case 500:
                        setError('Внутренняя ошибка сервера');
                        setDebugInfo('Попробуйте позже или обратитесь к администратору');
                        break;
                    default:
                        setError(`Ошибка сервера: ${status}`);
                        setDebugInfo(err.response.data?.message || 'Неизвестная ошибка');
                }
            } else if (err.request) {
                // Запрос был сделан, но ответа не получено
                setError('Сервер не отвечает');
                setDebugInfo('Проверьте подключение к сети или настройки сервера');
            } else {
                // Ошибка при настройке запроса
                setError('Ошибка при выполнении запроса');
                setDebugInfo(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setUsername('');
        setUserData(null);
        setError('');
        setDebugInfo('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSearch();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указано';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="user-search-container">
            <h1>🔍 Поиск пользователя</h1>
            <p className="page-description">
                Введите имя пользователя для получения информации из базы данных
            </p>

            {/* Секция поиска */}
            <div className="search-section">
                <div className="search-input-container">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Введите имя пользователя (например: anna_smith)"
                        className="search-input"
                        disabled={loading}
                    />
                    <div className="search-buttons">
                        <button
                            onClick={() => handleSearch()}
                            disabled={loading || !username.trim()}
                            className="search-button"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Поиск...
                                </>
                            ) : (
                                'Найти'
                            )}
                        </button>
                        <button
                            onClick={handleClear}
                            className="clear-button"
                            disabled={loading}
                        >
                            Очистить
                        </button>
                    </div>
                </div>
            </div>

            {/* Примеры пользователей для теста */}
            {exampleUsers.length > 0 && (
                <div className="examples-section">
                    <h4>Примеры пользователей для теста:</h4>
                    <div className="example-users">
                        {exampleUsers.map((user) => (
                            <button
                                key={user}
                                onClick={() => handleSearch(user)}
                                disabled={loading}
                                className="example-user-button"
                            >
                                {user}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* История поиска */}
            {searchHistory.length > 0 && (
                <div className="history-section">
                    <h4>История поиска:</h4>
                    <div className="history-list">
                        {searchHistory.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleSearch(item)}
                                disabled={loading}
                                className="history-item"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Сообщения об ошибках */}
            {error && (
                <div className="error-message">
                    <div className="error-icon">⚠️</div>
                    <div className="error-content">
                        <strong>Ошибка:</strong> {error}
                    </div>
                </div>
            )}

            {/* Отладочная информация */}
            {debugInfo && (
                <div className="debug-info">
                    <div className="debug-icon">ℹ️</div>
                    <div className="debug-content">
                        <strong>Информация:</strong> {debugInfo}
                    </div>
                </div>
            )}

            {/* Результаты поиска */}
            {userData && (
                <div className="results-section">
                    <div className="success-header">
                        <h2>✅ Пользователь найден</h2>
                        <div className="search-time">
                            Последний поиск: {new Date().toLocaleTimeString()}
                        </div>
                    </div>

                    <div className="user-profile-card">
                        <div className="profile-header">
                            <div className="avatar-placeholder">
                                {userData.firstName?.charAt(0) || userData.username?.charAt(0) || 'U'}
                            </div>
                            <div className="profile-info">
                                <h3>{userData.username}</h3>
                                <p className="user-email">{userData.email}</p>
                            </div>
                        </div>

                        <div className="user-details">
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">ID пользователя:</span>
                                    <span className="detail-value">{userData.userId}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Полное имя:</span>
                                    <span className="detail-value">
                                        {userData.firstName} {userData.lastName}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Имя:</span>
                                    <span className="detail-value">{userData.firstName || 'Не указано'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Фамилия:</span>
                                    <span className="detail-value">{userData.lastName || 'Не указано'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Дата регистрации:</span>
                                    <span className="detail-value">{formatDate(userData.createdAt)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Последнее обновление:</span>
                                    <span className="detail-value">{formatDate(userData.updatedAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="account-status">
                            <div className="status-item">
                                <span className="status-label">Статус аккаунта:</span>
                                <span className="status-value active">Активен</span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">В системе с:</span>
                                <span className="status-value">
                                    {new Date(userData.createdAt).toLocaleDateString('ru-RU')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Информация о корзине (если будет добавлена позже) */}
                    <div className="cart-info-section">
                        <h3>🛒 Корзина пользователя</h3>
                        <div className="cart-placeholder">
                            <p>Функционал корзины будет добавлен в будущих обновлениях</p>
                            <p className="placeholder-note">
                                Для отображения корзины потребуется добавить соответствующий API эндпоинт
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Инструкция по использованию */}
            {!userData && !error && (
                <div className="instructions">
                    <h3>Как использовать:</h3>
                    <ol>
                        <li>Введите имя пользователя в поле выше</li>
                        <li>Нажмите "Найти" или клавишу Enter</li>
                        <li>Или выберите одного из примеров пользователей</li>
                    </ol>
                    <div className="api-info">
                        <strong>Используемый API:</strong> GET http://localhost:9999/api/user/:username
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSearch;