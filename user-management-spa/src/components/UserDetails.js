import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUser, deleteUser } from '../services/userService';

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
                setError(err.message || 'Failed to load user');
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
            setError(err.message || 'Failed to delete user');
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h2>User Details</h2>
            {error && <p className="error">{error}</p>}
            <p>
                <strong>Username:</strong>
                {' '}
                {user.username}
            </p>
            <p>
                <strong>Email:</strong>
                {' '}
                {user.email}
            </p>
            <p>
                <strong>Role:</strong>
                {' '}
                {user.role}
            </p>
            {role === 'admin' && (
                <>
                    <Link to={`/users/${id}/edit`}>
                        <button type="button">Edit</button>
                    </Link>
                    <button type="button" onClick={handleDelete}>
                        Delete
                    </button>
                </>
            )}
            <Link to="/users">Back to Users</Link>
        </div>
    );
}

export default UserDetails;
