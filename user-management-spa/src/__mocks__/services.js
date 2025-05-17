// Mock file for API services
export const mockUsers = [
    { id: '1', username: 'admin', email: 'admin@test.com', role: 'admin' },
    { id: '2', username: 'user', email: 'user@test.com', role: 'user' }
];

export const mockFilms = [
    { id: '1', title: 'Film 1', duration: 120, description: 'Test description 1' },
    { id: '2', title: 'Film 2', duration: 90, description: 'Test description 2' }
];

// Auth service mocks
export const mockAuthService = {
    login: jest.fn().mockImplementation((username, password) => {
        if (username === 'admin' && password === 'password') {
            return Promise.resolve({
                access: 'fake-token',
                user: { username: 'admin', role: 'admin' }
            });
        }
        return Promise.reject(new Error('Невірне ім\'я користувача або пароль'));
    })
};

// User service mocks
export const mockUserService = {
    getUsers: jest.fn().mockResolvedValue(mockUsers),
    getUser: jest.fn().mockImplementation((id) => {
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            return Promise.resolve(user);
        }
        return Promise.reject(new Error('Користувача не знайдено'));
    }),
    createUser: jest.fn().mockImplementation((data) =>
        Promise.resolve({ id: '3', ...data })),
    updateUser: jest.fn().mockImplementation((id, data) =>
        Promise.resolve({ id, ...data })),
    deleteUser: jest.fn().mockResolvedValue({})
};

// Film service mocks
export const mockFilmService = {
    getFilms: jest.fn().mockResolvedValue(mockFilms),
    getFilm: jest.fn().mockImplementation((id) => {
        const film = mockFilms.find(f => f.id === id);
        if (film) {
            return Promise.resolve(film);
        }
        return Promise.reject(new Error('Фільм не знайдено'));
    }),
    createFilm: jest.fn().mockImplementation((data) =>
        Promise.resolve({ id: '3', ...data })),
    updateFilm: jest.fn().mockImplementation((id, data) =>
        Promise.resolve({ id, ...data })),
    deleteFilm: jest.fn().mockResolvedValue({})
};
