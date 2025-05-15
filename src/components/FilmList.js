import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFilms } from '../services/filmService';
import '../labcss.css';

function FilmList({ token, role }) {
    const [films, setFilms] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                setLoading(true);
                const data = await getFilms(token);
                setFilms(data);
                setError('');
            } catch (err) {
                setError(err.message || 'Не вдалося завантажити фільми');
                console.error('Помилка завантаження:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFilms();
    }, [token]);

    if (loading) {
        return <p>Завантаження...</p>;
    }

    return (
        <section className="film-list">
            <h2>Фільми</h2>
            {role === 'admin' && (
                <Link to="/films/new">
                    <button type="button">Додати фільм</button>
                </Link>
            )}
            {error && <p className="error">{error}</p>}
            {films.length === 0 && !error && <p>Немає фільмів</p>}
            <div className="film-grid">
                {films.map((film) => (
                    <article key={film.id} className="film-item">
                        <h3>{film.title}</h3>
                        <p>Тривалість: {film.duration} хвилин</p>
                        <p className="description">{film.description}</p>
                        {role === 'admin' && (
                            <Link to={`/films/${film.id}/edit`}>
                                <button type="button">Редагувати</button>
                            </Link>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}

export default FilmList;
