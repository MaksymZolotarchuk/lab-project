import { getFilms, getFilm, createFilm, updateFilm, deleteFilm } from '../filmService';

// Mock fetch
global.fetch = jest.fn();

describe('Film Service', () => {
    const mockToken = 'test-token';
    const mockFilm = { id: '1', title: 'Test Film', duration: 120, description: 'Test description' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getFilms fetches films with the correct URL and headers', async () => {
        // Mock successful response
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce([mockFilm])
        });

        const result = await getFilms(mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/films/', {
            headers: {
                Authorization: `Bearer ${mockToken}`
            }
        });
        expect(result).toEqual([mockFilm]);
    });

    test('getFilms throws an error when fetch fails', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'Failed to fetch films' })
        });

        await expect(getFilms(mockToken)).rejects.toThrow('Failed to fetch films');
    });

    test('getFilms throws an error when network error occurs', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(getFilms(mockToken)).rejects.toThrow('Помилка мережі: Network error');
    });

    test('getFilm fetches a single film with the correct URL and headers', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockFilm)
        });

        const result = await getFilm('1', mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/films/1/', {
            headers: {
                Authorization: `Bearer ${mockToken}`
            }
        });
        expect(result).toEqual(mockFilm);
    });

    test('getFilm throws an error when fetch fails', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'Film not found' })
        });

        await expect(getFilm('1', mockToken)).rejects.toThrow('Film not found');
    });

    test('createFilm sends POST with correct data and headers', async () => {
        const filmData = { title: 'New Film', duration: 90, description: 'New description' };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: '2', ...filmData })
        });

        const result = await createFilm(filmData, mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/films/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mockToken}`
            },
            body: JSON.stringify(filmData)
        });
        expect(result).toEqual({ id: '2', ...filmData });
    });

    test('createFilm throws an error when fetch fails', async () => {
        const filmData = { title: 'New Film', duration: 90 };

        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'Missing required fields' })
        });

        await expect(createFilm(filmData, mockToken)).rejects.toThrow('Missing required fields');
    });

    test('updateFilm sends PUT with correct data and headers', async () => {
        const filmData = { title: 'Updated Film', duration: 150, description: 'Updated description' };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: '1', ...filmData })
        });

        const result = await updateFilm('1', filmData, mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/films/1/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mockToken}`
            },
            body: JSON.stringify(filmData)
        });
        expect(result).toEqual({ id: '1', ...filmData });
    });

    test('updateFilm throws an error when fetch fails', async () => {
        const filmData = { title: 'Updated Film' };

        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'Film not found' })
        });

        await expect(updateFilm('1', filmData, mockToken)).rejects.toThrow('Film not found');
    });

    test('deleteFilm sends DELETE with correct URL and headers', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({})
        });

        await deleteFilm('1', mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/films/1/', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${mockToken}`
            }
        });
    });

    test('deleteFilm throws an error when fetch fails', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'Cannot delete film' })
        });

        await expect(deleteFilm('1', mockToken)).rejects.toThrow('Cannot delete film');
    });
});
