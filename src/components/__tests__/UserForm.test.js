// src/components/__tests__/UserForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserForm from '../UserForm';
import * as userService from '../../services/userService';
import { useParams, useNavigate } from 'react-router-dom';

jest.mock('../../services/userService');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

const mockToken = 'mock-token';
const mockUser = { username: 'testuser', email: 'test@example.com', role: 'admin' };

const renderWithRouter = (component) => {
    return render(
        <MemoryRouter>
            <Routes>
                <Route path="*" element={component} />
            </Routes>
        </MemoryRouter>
    );
};

describe('UserForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(jest.fn());
    });

    test('renders form in create mode when no id is provided', () => {
        useParams.mockReturnValue({});
        renderWithRouter(<UserForm token={mockToken} />);
        expect(screen.getByText('Створити користувача')).toBeInTheDocument();
        expect(screen.getByLabelText('Ім’я користувача:')).toBeInTheDocument();
    });

    test('renders form in edit mode and loads user data when id is provided', async () => {
        useParams.mockReturnValue({ id: '1' });
        userService.getUser.mockResolvedValue(mockUser);

        renderWithRouter(<UserForm token={mockToken} />);

        await waitFor(() => {
            expect(screen.getByText('Редагувати користувача')).toBeInTheDocument();
            expect(screen.getByLabelText('Ім’я користувача:')).toHaveValue('testuser');
            expect(userService.getUser).toHaveBeenCalledWith('1', mockToken);
        });
    });

    test('handles input changes correctly', async () => {
        useParams.mockReturnValue({ id: '1' });
        userService.getUser.mockResolvedValue(mockUser);

        renderWithRouter(<UserForm token={mockToken} />);

        await waitFor(() => {
            expect(screen.getByLabelText('Ім’я користувача:')).toHaveValue(mockUser.username);
        });

        fireEvent.change(screen.getByLabelText('Ім’я користувача:'), {
            target: { value: 'newuser' },
        });
        expect(screen.getByLabelText('Ім’я користувача:')).toHaveValue('newuser');
    });

    test('validates form input and shows errors', async () => {
        useParams.mockReturnValue({});
        renderWithRouter(<UserForm token={mockToken} />);

        fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
        expect(screen.getByText('Ім’я користувача обов’язкове')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Ім’я користувача:'), {
            target: { value: 'testuser' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
        expect(screen.getByText('Пароль обов’язковий для нових користувачів')).toBeInTheDocument();
    });

    test('submits form and creates new user', async () => {
        useParams.mockReturnValue({});
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        userService.createUser.mockResolvedValue({});

        renderWithRouter(<UserForm token={mockToken} />);

        fireEvent.change(screen.getByLabelText('Ім’я користувача:'), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText('Пароль:'), {
            target: { value: 'password' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

        await waitFor(() => {
            expect(userService.createUser).toHaveBeenCalledWith(
                expect.objectContaining({ username: 'testuser', password: 'password' }),
                mockToken
            );
            expect(mockNavigate).toHaveBeenCalledWith('/users');
        });
    });

    test('submits form and updates existing user', async () => {
        useParams.mockReturnValue({ id: '1' });
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        userService.updateUser.mockResolvedValue({});

        renderWithRouter(<UserForm token={mockToken} />);

        fireEvent.change(screen.getByLabelText('Ім’я користувача:'), {
            target: { value: 'updateduser' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

        await waitFor(() => {
            expect(userService.updateUser).toHaveBeenCalledWith('1', expect.any(Object), mockToken);
            expect(mockNavigate).toHaveBeenCalledWith('/users');
        });
    });

    test('shows error when form submission fails', async () => {
        useParams.mockReturnValue({ id: '1' });
        userService.getUser.mockResolvedValue(mockUser);
        userService.updateUser.mockRejectedValue(new Error('Update failed'));

        renderWithRouter(<UserForm token={mockToken} />);

        await waitFor(() => {
            expect(screen.getByLabelText('Ім’я користувача:')).toHaveValue(mockUser.username);
        });

        fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

        await waitFor(() => {
            expect(screen.getByText('Update failed')).toBeInTheDocument();
        });
    });
});
