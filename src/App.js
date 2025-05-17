import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetails from './components/UserDetails';
import FilmList from './components/FilmList';
import FilmForm from './components/FilmForm';
import './labcss.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);

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
      <div className="app-container">
        <header>
          <h1>Управління кінотеатром</h1>
          {token && (
            <nav className="nav-menu">
              <Link to="/users">Користувачі</Link>
              <Link to="/films">Фільми</Link>
              <Logout onLogout={handleLogout} />
            </nav>
          )}
        </header>
        <main>
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
              element={token && role === 'admin' ? <UserForm token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/users/:id"
              element={token ? <UserDetails token={token} role={role} /> : <Navigate to="/login" />}
            />
            <Route
              path="/users/:id/edit"
              element={token && role === 'admin' ? <UserForm token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/films"
              element={token ? <FilmList token={token} role={role} /> : <Navigate to="/login" />}
            />
            <Route
              path="/films/new"
              element={token && role === 'admin' ? <FilmForm token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/films/:id/edit"
              element={token && role === 'admin' ? <FilmForm token={token} /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to={token ? '/users' : '/login'} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
