// src/services/authService.js
export default async function login(username, password) {
    try {
        const response = await fetch('http://localhost:8001/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Не вдалося увійти');
        }

        return response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}
