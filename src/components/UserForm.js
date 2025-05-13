import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createUser, getUser, updateUser } from '../services/userService';

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
                    setError(err.message || 'Failed to load user');
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
            setError('Username is required');
            return;
        }
        if (!id && !formData.password) {
            setError('Password is required for new users');
            return;
        }
        if (!['user', 'admin'].includes(formData.role)) {
            setError('Invalid role selected');
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
            setError(err.message || 'Failed to save user');
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit User' : 'Create User'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder={id ? 'New Password (optional)' : 'Password'}
                    value={formData.password}
                    onChange={handleChange}
                />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Save</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default UserForm;
