import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUser, deleteUser } from '../services/userService';
import '../labcss.css';

function UserDetails({ token, role }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUser(id, token);
                setUser(data);
                setError('');
            } catch (err) {
                setError(err.message || 'Не вдалося завантажити користувача');
            }
        };
        fetchUser();
    }, [id, token]);

    const handleDelete = async () => {
        try {
            await deleteUser(id, token);
            navigate('/users');
            setError('');
        } catch (err) {
            setError(err.message || 'Не вдалося видалити користувача');
        }
    };

    if (!user) return <p>Завантаження...</p>;

    return (
        <section className="user-details">
            <h2>Деталі користувача</h2>
            {error && <p className="error">{error}</p>}
            <p><strong>Ім’я:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Роль:</strong> {user.role}</p>
            {role === 'admin' && (
                <div className="user-actions">
                    <Link to={`/users/${id}/edit`}>
                        <button type="button">Редагувати</button>
                    </Link>
                    <button type="button" onClick={handleDelete}>
                        Видалити
                    </button>
                </div>
            )}
            <Link to="/users">Назад до користувачів</Link>
        </section>
    );
}

export default UserDetails;
