export async function getUsers(token) {
    try {
        const response = await fetch('http://localhost:8001/api/users/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to fetch users: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Network error: ${error.message}`);
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
            throw new Error(errorData.error || `Failed to fetch user: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Network error: ${error.message}`);
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
            throw new Error(errorData.error || `Failed to create user: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Network error: ${error.message}`);
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
            throw new Error(errorData.error || `Failed to update user: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Network error: ${error.message}`);
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
            throw new Error(errorData.error || `Failed to delete user: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Network error: ${error.message}`);
    }
}
