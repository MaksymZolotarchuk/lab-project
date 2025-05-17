import React from 'react';
import '../labcss.css';

function Logout({ onLogout }) {
    const handleLogout = () => {
        onLogout();
    };

    return (
        <button onClick={handleLogout} type="button" className="logout-button">
            Вийти
        </button>
    );
}

export default Logout;
