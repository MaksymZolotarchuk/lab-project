import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Logout from './components/Logout';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetails from './components/UserDetails';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    const handleLogin = (newToken, userRole) => {
        setToken(newToken);
        setRole(userRole);
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', userRole);
    };

    const handleLogout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    return (
        <Router>
            <div>
                <h1>User Management</h1>
                {token && <Logout onLogout={handleLogout} />}
                <Routes>
                    <Route
                        path="/login"
                        element={token ? <Navigate to="/users" /> : <Login onLogin={handleLogin} />}
                    />
                    <Route
                        path="/users"
                        element={token ? <UserList token={token} role={role} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/users/new"
                        element={
                            token && role === 'admin' ? (
                                <UserForm token={token} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/users/:id"
                        element={token ? <UserDetails token={token} role={role} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/users/:id/edit"
                        element={
                            token && role === 'admin' ? (
                                <UserForm token={token} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
