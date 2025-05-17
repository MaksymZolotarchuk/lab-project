import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FilmList from '../FilmList';
import * as filmService from '../../services/filmService';

jest.mock('../../services/filmService');

describe('FilmList', () => {
    const mockToken = 'mock-token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays loading state', () => {
        render(
            <MemoryRouter>
                <FilmList token={mockToken} role="user" />
            </MemoryRouter>
        );
        expect(screen.getByText('Завантаження...')).toBeInTheDocument();
    });

    test('displays films correctly', async () => {
        const mockFilms = [
            { id: 1, title: 'Film 1', duration: 120, description: 'Desc 1' },
            { id: 2, title: 'Film 2', duration: 90, description: 'Desc 2' },
        ];
        filmService.getFilms.mockResolvedValue(mockFilms);

        render(
            <MemoryRouter>
                <FilmList token={mockToken} role="user" />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Film 1')).toBeInTheDocument();
            expect(screen.getByText('Film 2')).toBeInTheDocument();
            expect(screen.getByText('Тривалість: 120 хвилин')).toBeInTheDocument();
            expect(screen.getByText('Desc 1')).toBeInTheDocument();
        });
    });

    test('shows add button for admin', async () => {
        filmService.getFilms.mockResolvedValue([]);
        render(
            <MemoryRouter>
                <FilmList token={mockToken} role="admin" />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Додати фільм' })).toBeInTheDocument();
        });
    });

    test('shows no films message', async () => {
        filmService.getFilms.mockResolvedValue([]);
        render(
            <MemoryRouter>
                <FilmList token={mockToken} role="user" />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Немає фільмів')).toBeInTheDocument();
        });
    });

    test('displays error message', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        filmService.getFilms.mockRejectedValue(new Error('Fetch error'));
        render(
            <MemoryRouter>
                <FilmList token={mockToken} role="user" />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Fetch error')).toBeInTheDocument();
        });
        console.error.mockRestore();
    });
});
