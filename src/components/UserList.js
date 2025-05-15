import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/userService';
import '../labcss.css';

function UserList({ token, role }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getUsers(token);
                setUsers(data);
                setError('');
            } catch (err) {
                setError(err.message || 'Не вдалося завантажити користувачів');
                console.error('Помилка завантаження:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    if (loading) {
        return <p>Завантаження...</p>;
    }

    return (
        <section className="user-list">
            <h2>Користувачі</h2>
            {role === 'admin' && (
                <Link to="/users/new">
                    <button type="button">Додати користувача</button>
                </Link>
            )}
            {error && <p className="error">{error}</p>}
            {users.length === 0 && !error && <p>Немає користувачів</p>}
            <div className="user-table">
                {users.map((user) => (
                    <article key={user.id} className="user-item">
                        <Link to={`/users/${user.id}`}>
                            {user.username} ({user.role || 'невідомо'})
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default UserList;
