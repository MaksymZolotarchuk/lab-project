import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createFilm, getFilm, updateFilm } from '../services/filmService';
import '../labcss.css';

function FilmForm({ token }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        duration: '',
        description: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchFilm = async () => {
                try {
                    const film = await getFilm(id, token);
                    setFormData({
                        title: film.title,
                        duration: film.duration,
                        description: film.description,
                    });
                    setError('');
                } catch (err) {
                    setError(err.message || 'Не вдалося завантажити фільм');
                }
            };
            fetchFilm();
        }
    }, [id, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.duration) {
            setError('Назва та тривалість обов’язкові');
            return;
        }
        if (isNaN(formData.duration) || formData.duration <= 0) {
            setError('Тривалість має бути додатним числом');
            return;
        }

        try {
            if (id) {
                await updateFilm(id, formData, token);
            } else {
                await createFilm(formData, token);
            }
            navigate('/films');
            setError('');
        } catch (err) {
            setError(err.message || 'Не вдалося зберегти фільм');
        }
    };

    return (
        <section className="film-form">
            <h2>{id ? 'Редагувати фільм' : 'Створити фільм'}</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="title">Назва:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Введіть назву"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Тривалість (хвилини):</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        placeholder="Введіть тривалість"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Опис:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Введіть опис"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Зберегти</button>
                {error && <p className="error">{error}</p>}
            </form>
        </section>
    );
}

export default FilmForm;
