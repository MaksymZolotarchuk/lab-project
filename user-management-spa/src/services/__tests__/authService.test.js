// src/services/__tests__/authService.test.js
import login from '../authService'; // This should be correct if authService.js is in src/services/

describe('Auth Service', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('login sends POST request with correct credentials', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access: 'token', user: { role: 'user' } }),
        });

        const result = await login('testuser', 'password');

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ username: 'testuser', password: 'password' }),
        });
        expect(result).toEqual({ access: 'token', user: { role: 'user' } });
    });

    test('login throws an error when fetch fails without error message', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({}),
        });

        await expect(login('wronguser', 'wrongpass')).rejects.toThrow('Не вдалося увійти');
    });

    test('login throws an error when network error occurs', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(login('testuser', 'password')).rejects.toThrow('Network error');
    });
});
