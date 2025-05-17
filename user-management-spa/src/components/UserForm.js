import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createUser, getUser, updateUser } from '../services/userService';
import '../labcss.css';

function UserForm({ token }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const user = await getUser(id, token);
                    setFormData({
                        username: user.username,
                        email: user.email,
                        password: '',
                        role: user.role || 'user',
                    });
                    setError('');
                } catch (err) {
                    setError(err.message || 'Не вдалося завантажити користувача');
                }
            };
            fetchUser();
        }
    }, [id, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username) {
            setError('Ім’я користувача обов’язкове');
            return;
        }
        if (!id && !formData.password) {
            setError('Пароль обов’язковий для нових користувачів');
            return;
        }
        if (!['user', 'admin'].includes(formData.role)) {
            setError('Невірна роль');
            return;
        }

        try {
            if (id) {
                await updateUser(id, formData, token);
            } else {
                await createUser(formData, token);
            }
            navigate('/users');
            setError('');
        } catch (err) {
            setError(err.message || 'Не вдалося зберегти користувача');
        }
    };

    return (
        <section className="user-form">
            <h2>{id ? 'Редагувати користувача' : 'Створити користувача'}</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="username">Ім’я користувача:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Введіть ім’я"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Електронна пошта:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Введіть email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder={id ? 'Новий пароль (необов’язково)' : 'Введіть пароль'}
                        value={formData.password}
                        onChange={handleChange}
                        required={!id}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Роль:</label>
                    <select id="role" name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">Користувач</option>
                        <option value="admin">Адмін</option>
                    </select>
                </div>
                <button type="submit">Зберегти</button>
                {error && <p className="error">{error}</p>}
            </form>
        </section>
    );
}

export default UserForm;
