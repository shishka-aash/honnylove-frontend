import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Register = ({ updateAuthStatus }) => {
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Данные для регистрации
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });

    // Данные для логина
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    // Ошибки для регистрации
    const [registerErrors, setRegisterErrors] = useState({});
    // Ошибки для логина
    const [loginErrors, setLoginErrors] = useState({});

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
        if (registerErrors[name]) {
            setRegisterErrors({
                ...registerErrors,
                [name]: ''
            });
        }
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
        if (loginErrors[name]) {
            setLoginErrors({
                ...loginErrors,
                [name]: ''
            });
        }
    };

    const validateRegisterForm = () => {
        const newErrors = {};
        
        if (!registerData.username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        } else if (registerData.username.length < 3) {
            newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
        }

        if (!registerData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!registerData.firstName.trim()) {
            newErrors.firstName = 'Имя обязательно';
        }

        if (!registerData.lastName.trim()) {
            newErrors.lastName = 'Фамилия обязательна';
        }

        if (!registerData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (registerData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (!registerData.confirmPassword) {
            newErrors.confirmPassword = 'Подтвердите пароль';
        } else if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        return newErrors;
    };

    const validateLoginForm = () => {
        const newErrors = {};
        
        if (!loginData.username.trim()) {
            newErrors.username = 'Имя пользователя или email обязательны';
        }

        if (!loginData.password) {
            newErrors.password = 'Пароль обязателен';
        }

        return newErrors;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateRegisterForm();
        if (Object.keys(validationErrors).length > 0) {
            setRegisterErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:9999/api/user/adduser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerData.username,
                    email: registerData.email,
                    firstName: registerData.firstName,
                    lastName: registerData.lastName,
                    password: registerData.password
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage('Регистрация прошла успешно! Теперь вы можете войти в систему.');
                
                // Очищаем форму
                setRegisterData({
                    username: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    password: '',
                    confirmPassword: ''
                });
                
                // Переключаем на форму логина
                setIsLogin(true);
            } else {
                setErrorMessage(data.message || 'Ошибка при регистрации');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage('Ошибка соединения с сервером');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateLoginForm();
        if (Object.keys(validationErrors).length > 0) {
            setLoginErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:9999/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginData.username,
                    password: loginData.password
                })
            });

            const data = await response.json();

            if (data.success) {
                // Сохраняем данные пользователя
                localStorage.setItem('user', JSON.stringify(data.data.user));
                localStorage.setItem('isAuthenticated', 'true');
                
                // Обновляем статус авторизации в App.js
                updateAuthStatus(true);
                
                setSuccessMessage('Вход выполнен успешно! Перенаправляем в профиль...');
                
                // Перенаправляем в профиль через 2 секунды
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            } else {
                setErrorMessage(data.message || 'Ошибка при авторизации');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Ошибка соединения с сервером');
        } finally {
            setIsSubmitting(false);
        }
    };

    const switchToLogin = () => {
        setIsLogin(true);
        setErrorMessage('');
        setSuccessMessage('');
        setRegisterErrors({});
    };

    const switchToRegister = () => {
        setIsLogin(false);
        setErrorMessage('');
        setSuccessMessage('');
        setLoginErrors({});
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="profile">
            <div className="container">
                <h1 className="page-title">
                    {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
                </h1>

                <div className="profile-content">
                    <div className="profile-info" style={{ gridColumn: '1 / -1', maxWidth: '500px', margin: '0 auto' }}>
                        <h2>
                            {isLogin ? 'Введите ваши данные' : 'Создание нового аккаунта'}
                        </h2>
                        
                        {successMessage && (
                            <div className="success-message">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="error-message">
                                {errorMessage}
                            </div>
                        )}

                        <div className="auth-tabs">
                            <button 
                                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                                onClick={switchToRegister}
                            >
                                Регистрация
                            </button>
                            <button 
                                className={`auth-tab ${isLogin ? 'active' : ''}`}
                                onClick={switchToLogin}
                            >
                                Вход
                            </button>
                        </div>

                        {isLogin ? (
                            // Форма логина
                            <form onSubmit={handleLoginSubmit} className="info-card">
                                <div className="input-group">
                                    <label htmlFor="login-username">Имя пользователя или Email*</label>
                                    <input
                                        type="text"
                                        id="login-username"
                                        name="username"
                                        value={loginData.username}
                                        onChange={handleLoginChange}
                                        placeholder="Введите username или email"
                                        className={loginErrors.username ? 'error' : ''}
                                    />
                                    {loginErrors.username && (
                                        <span className="error-text">
                                            {loginErrors.username}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="login-password">Пароль*</label>
                                    <input
                                        type="password"
                                        id="login-password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        placeholder="Введите пароль"
                                        className={loginErrors.password ? 'error' : ''}
                                    />
                                    {loginErrors.password && (
                                        <span className="error-text">
                                            {loginErrors.password}
                                        </span>
                                    )}
                                </div>

                                <div className="edit-actions" style={{ marginTop: '2rem' }}>
                                    <button
                                        type="submit"
                                        className="save-btn"
                                        disabled={isSubmitting}
                                        style={{ 
                                            opacity: isSubmitting ? 0.7 : 1,
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isSubmitting ? 'Вход...' : 'Войти'}
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={handleCancel}
                                    >
                                        На главную
                                    </button>
                                </div>

                                <div style={{ 
                                    marginTop: '1.5rem', 
                                    textAlign: 'center',
                                    color: 'var(--text-color)'
                                }}>
                                    <p>
                                        Нет аккаунта?{' '}
                                        <button 
                                            type="button"
                                            onClick={switchToRegister}
                                            className="auth-switch-btn"
                                        >
                                            Зарегистрироваться
                                        </button>
                                    </p>
                                </div>
                            </form>
                        ) : (
                            // Форма регистрации
                            <form onSubmit={handleRegisterSubmit} className="info-card">
                                <div className="input-group">
                                    <label htmlFor="register-username">Имя пользователя*</label>
                                    <input
                                        type="text"
                                        id="register-username"
                                        name="username"
                                        value={registerData.username}
                                        onChange={handleRegisterChange}
                                        placeholder="Введите имя пользователя"
                                        className={registerErrors.username ? 'error' : ''}
                                    />
                                    {registerErrors.username && (
                                        <span className="error-text">
                                            {registerErrors.username}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="register-email">Email*</label>
                                    <input
                                        type="email"
                                        id="register-email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        placeholder="Введите ваш email"
                                        className={registerErrors.email ? 'error' : ''}
                                    />
                                    {registerErrors.email && (
                                        <span className="error-text">
                                            {registerErrors.email}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="register-firstName">Имя*</label>
                                    <input
                                        type="text"
                                        id="register-firstName"
                                        name="firstName"
                                        value={registerData.firstName}
                                        onChange={handleRegisterChange}
                                        placeholder="Введите ваше имя"
                                        className={registerErrors.firstName ? 'error' : ''}
                                    />
                                    {registerErrors.firstName && (
                                        <span className="error-text">
                                            {registerErrors.firstName}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="register-lastName">Фамилия*</label>
                                    <input
                                        type="text"
                                        id="register-lastName"
                                        name="lastName"
                                        value={registerData.lastName}
                                        onChange={handleRegisterChange}
                                        placeholder="Введите вашу фамилию"
                                        className={registerErrors.lastName ? 'error' : ''}
                                    />
                                    {registerErrors.lastName && (
                                        <span className="error-text">
                                            {registerErrors.lastName}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="register-password">Пароль*</label>
                                    <input
                                        type="password"
                                        id="register-password"
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        placeholder="Введите пароль"
                                        className={registerErrors.password ? 'error' : ''}
                                    />
                                    {registerErrors.password && (
                                        <span className="error-text">
                                            {registerErrors.password}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="register-confirmPassword">Подтверждение пароля*</label>
                                    <input
                                        type="password"
                                        id="register-confirmPassword"
                                        name="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        placeholder="Повторите пароль"
                                        className={registerErrors.confirmPassword ? 'error' : ''}
                                    />
                                    {registerErrors.confirmPassword && (
                                        <span className="error-text">
                                            {registerErrors.confirmPassword}
                                        </span>
                                    )}
                                </div>

                                <div className="edit-actions" style={{ marginTop: '2rem' }}>
                                    <button
                                        type="submit"
                                        className="save-btn"
                                        disabled={isSubmitting}
                                        style={{ 
                                            opacity: isSubmitting ? 0.7 : 1,
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={handleCancel}
                                    >
                                        На главную
                                    </button>
                                </div>

                                <div style={{ 
                                    marginTop: '1.5rem', 
                                    textAlign: 'center',
                                    color: 'var(--text-color)'
                                }}>
                                    <p>
                                        Уже есть аккаунт?{' '}
                                        <button 
                                            type="button"
                                            onClick={switchToLogin}
                                            className="auth-switch-btn"
                                        >
                                            Войти
                                        </button>
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;