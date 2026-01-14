// server/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Подключение к MySQL - ОБНОВИТЕ ЭТИ ДАННЫЕ!
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', // ← ваш пользователь MySQL
    password: 'ваш_пароль', // ← ваш пароль MySQL
    database: 'ваша_база_данных', // ← имя вашей базы данных
});

// Проверка подключения
db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к MySQL:', err);
        return;
    }
    console.log('✅ Успешное подключение к MySQL на порту 3380');
});

// Роут для поиска пользователя
app.get('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        console.log('🔍 Поиск пользователя:', username);

        const query = `
            SELECT 
                u.*,
                c.cart_id,
                c.product_id,
                c.quantity,
                c.added_at
            FROM users u
            LEFT JOIN cart c ON u.user_id = c.user_id
            WHERE u.username = ?
        `;

        db.query(query, [username], (error, results) => {
            if (error) {
                console.error('❌ Ошибка запроса:', error);
                return res.status(500).json({ error: 'Ошибка базы данных' });
            }

            console.log('📊 Найдено записей:', results.length);

            if (results.length === 0) {
                console.log('❌ Пользователь не найден');
                return res
                    .status(404)
                    .json({ error: 'Пользователь не найден' });
            }

            // Форматируем данные
            const userData = {
                user_id: results[0].user_id,
                username: results[0].username,
                email: results[0].email,
                first_name: results[0].first_name,
                last_name: results[0].last_name,
                created_at: results[0].created_at,
                updated_at: results[0].updated_at,
                cart: results
                    .filter((row) => row.cart_id !== null)
                    .map((row) => ({
                        cart_id: row.cart_id,
                        product_id: row.product_id,
                        quantity: row.quantity,
                        added_at: row.added_at,
                    })),
            };

            console.log('✅ Найден пользователь:', userData.username);
            res.json(userData);
        });
    } catch (error) {
        console.error('💥 Ошибка сервера:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Тестовый роут
app.get('/api/test', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

// Роут для получения списка всех пользователей (для отладки)
app.get('/api/all-users', (req, res) => {
    db.query(
        'SELECT user_id, username, email FROM users LIMIT 10',
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Ошибка базы данных' });
            }
            res.json(results);
        }
    );
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
