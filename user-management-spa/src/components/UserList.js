import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/userService';

function UserList({ token, role }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers(token);
                setUsers(data);
                setError('');
            } catch (err) {
                setError(err.message || 'Failed to load users');
                console.error('Fetch error:', err);
            }
        };
        fetchUsers();
    }, [token]);

    return (
        <div>
            <h2>Users</h2>
            {role === 'admin' && (
                <Link to="/users/new">
                    <button type="button">Add User</button>
                </Link>
            )}
            {error && <p className="error">{error}</p>}
            <div className="user-list">
                {users.map((user) => (
                    <div key={user.id}>
                        <Link to={`/users/${user.id}`}>
                            {user.username}
                            {' '}
                            (
                            {user.role || 'Unknown'}
                            )
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserList;
