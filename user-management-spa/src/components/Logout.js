import React from 'react';

function Logout({ onLogout }) {
    const handleLogout = () => {
        onLogout();
    };

    return (
        <button onClick={handleLogout} type="button">
            Logout
        </button>
    );
}

export default Logout;
