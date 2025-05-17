export async function getUsers(token) {
    try {
        const response = await fetch('http://localhost:8001/api/users/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося завантажити користувачів: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}

export async function getUser(id, token) {
    try {
        const response = await fetch(`http://localhost:8001/api/users/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося завантажити користувача: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}

export async function createUser(data, token) {
    try {
        const response = await fetch('http://localhost:8001/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося створити користувача: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}

export async function updateUser(id, data, token) {
    try {
        const response = await fetch(`http://localhost:8001/api/users/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося оновити користувача: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}

export async function deleteUser(id, token) {
    try {
        const response = await fetch(`http://localhost:8001/api/users/${id}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося видалити користувача: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}
