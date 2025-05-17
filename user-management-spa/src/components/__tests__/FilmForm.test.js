import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FilmForm from '../FilmForm';
import * as filmService from '../../services/filmService';
import { useParams, useNavigate } from 'react-router-dom';

jest.mock('../../services/filmService');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

describe('FilmForm Component', () => {
    const mockNavigate = jest.fn();
    const mockToken = 'mock-token';

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        useParams.mockReturnValue({ id: '1' });
        filmService.getFilm.mockResolvedValue({
            id: '1',
            title: 'Test Film',
            duration: 120,
            description: 'Test Description',
        });
        filmService.updateFilm.mockResolvedValue({});
    });

    test('submits form and updates existing film', async () => {
        render(
            <MemoryRouter initialEntries={['/films/1/edit']}>
                <Routes>
                    <Route path="/films/:id/edit" element={<FilmForm token={mockToken} />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('Назва:')).toHaveValue('Test Film');
            expect(screen.getByLabelText('Тривалість (хвилини):')).toHaveValue(120);
            expect(screen.getByLabelText('Опис:')).toHaveValue('Test Description');
        });

        fireEvent.change(screen.getByLabelText('Назва:'), { target: { value: 'Updated Film' } });
        fireEvent.change(screen.getByLabelText('Тривалість (хвилини):'), { target: { value: '150' } });
        fireEvent.change(screen.getByLabelText('Опис:'), { target: { value: 'Updated Description' } });

        fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

        await waitFor(() => {
            expect(filmService.updateFilm).toHaveBeenCalledWith(
                '1',
                {
                    title: 'Updated Film',
                    duration: "150",
                    description: 'Updated Description',
                },
                mockToken
            );
            expect(mockNavigate).toHaveBeenCalledWith('/films');
        });
    });
});
