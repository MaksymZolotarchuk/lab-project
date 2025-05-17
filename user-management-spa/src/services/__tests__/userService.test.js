import { getUsers, getUser, createUser, updateUser, deleteUser } from '../userService';

// Mock fetch
global.fetch = jest.fn();

describe('User Service', () => {
    const mockToken = 'test-token';
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', role: 'user' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getUsers fetches users with the correct URL and headers', async () => {
        // Mock successful response
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce([mockUser])
        });

        const result = await getUsers(mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/users/', {
            headers: {
                Authorization: `Bearer ${mockToken}`
            }
        });
        expect(result).toEqual([mockUser]);
    });

    test('getUsers throws an error when fetch fails', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'Failed to fetch users' })
        });

        await expect(getUsers(mockToken)).rejects.toThrow('Failed to fetch users');
    });

    test('getUsers throws an error when network error occurs', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(getUsers(mockToken)).rejects.toThrow('Помилка мережі: Network error');
    });

    test('getUser fetches a single user with the correct URL and headers', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockUser)
        });

        const result = await getUser('1', mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/users/1/', {
            headers: {
                Authorization: `Bearer ${mockToken}`
            }
        });
        expect(result).toEqual(mockUser);
    });

    test('getUser throws an error when fetch fails', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'User not found' })
        });

        await expect(getUser('1', mockToken)).rejects.toThrow('User not found');
    });

    test('createUser sends POST with correct data and headers', async () => {
        const userData = { username: 'newuser', password: 'password', role: 'user' };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: '2', ...userData })
        });

        const result = await createUser(userData, mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mockToken}`
            },
            body: JSON.stringify(userData)
        });
        expect(result).toEqual({ id: '2', ...userData });
    });

    test('createUser throws an error when fetch fails', async () => {
        const userData = { username: 'newuser', password: 'password', role: 'user' };

        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'Username already exists' })
        });

        await expect(createUser(userData, mockToken)).rejects.toThrow('Username already exists');
    });

    test('updateUser sends PUT with correct data and headers', async () => {
        const userData = { username: 'updateduser', email: 'updated@example.com', role: 'admin' };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: '1', ...userData })
        });

        const result = await updateUser('1', userData, mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/users/1/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mockToken}`
            },
            body: JSON.stringify(userData)
        });
        expect(result).toEqual({ id: '1', ...userData });
    });

    test('updateUser throws an error when fetch fails', async () => {
        const userData = { username: 'updateduser' };

        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'User not found' })
        });

        await expect(updateUser('1', userData, mockToken)).rejects.toThrow('User not found');
    });

    test('deleteUser sends DELETE with correct URL and headers', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({})
        });

        await deleteUser('1', mockToken);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8001/api/users/1/', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${mockToken}`
            }
        });
    });

    test('deleteUser throws an error when fetch fails', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({ error: 'Cannot delete user' })
        });

        await expect(deleteUser('1', mockToken)).rejects.toThrow('Cannot delete user');
    });
});
