export async function getFilms(token) {
    try {
        const response = await fetch('http://localhost:8001/api/films/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося завантажити фільми: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}

export async function getFilm(id, token) {
    try {
        const response = await fetch(`http://localhost:8001/api/films/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося завантажити фільм: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}

export async function createFilm(data, token) {
    try {
        const response = await fetch('http://localhost:8001/api/films/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося створити фільм: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}

export async function updateFilm(id, data, token) {
    try {
        const response = await fetch(`http://localhost:8001/api/films/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Не вдалося оновити фільм: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Помилка мережі: ${error.message}`);
    }
}
