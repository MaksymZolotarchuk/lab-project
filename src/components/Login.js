import React, { useState } from 'react';
import login from '../services/authService';
import '../labcss.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Ім’я користувача та пароль обов’язкові');
            return;
        }

        try {
            const { access, user } = await login(username, password);
            onLogin(access, user.role);
            setError('');
        } catch (err) {
            setError(err.message || 'Не вдалося увійти');
        }
    };

    return (
        <section className="login-container">
            <h2>Вхід</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="username">Ім’я користувача:</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Введіть ім’я"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Введіть пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Увійти</button>
                {error && <p className="error">{error}</p>}
            </form>
        </section>
    );
}

export default Login;
