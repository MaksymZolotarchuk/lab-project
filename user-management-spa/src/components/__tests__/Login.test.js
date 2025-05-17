// src/components/__tests__/Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import * as authService from '../../services/authService';

jest.mock('../../services/authService');

describe('Login Component', () => {
    const mockOnLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form correctly', () => {
        render(<Login onLogin={mockOnLogin} />);
        expect(screen.getByText('Вхід')).toBeInTheDocument();
        expect(screen.getByLabelText('Ім’я користувача:')).toBeInTheDocument();
        expect(screen.getByLabelText('Пароль:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Увійти' })).toBeInTheDocument();
    });

    test('shows error when submitting with empty fields', async () => {
        render(<Login onLogin={mockOnLogin} />);
        fireEvent.click(screen.getByRole('button', { name: 'Увійти' }));
        expect(screen.getByText('Ім’я користувача та пароль обов’язкові')).toBeInTheDocument();
        expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('calls login service and onLogin when form is submitted with valid data', async () => {
        authService.default.mockResolvedValueOnce({ access: 'token', user: { role: 'user' } });

        render(<Login onLogin={mockOnLogin} />);
        fireEvent.change(screen.getByLabelText('Ім’я користувача:'), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText('Пароль:'), {
            target: { value: 'password' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Увійти' }));

        await waitFor(() => {
            expect(authService.default).toHaveBeenCalledWith('testuser', 'password');
            expect(mockOnLogin).toHaveBeenCalledWith('token', 'user');
        });
    });

    test('shows error message when login fails', async () => {
        authService.default.mockRejectedValueOnce(new Error('Login failed'));

        render(<Login onLogin={mockOnLogin} />);
        fireEvent.change(screen.getByLabelText('Ім’я користувача:'), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText('Пароль:'), {
            target: { value: 'password' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Увійти' }));

        await waitFor(() => {
            expect(screen.getByText('Login failed')).toBeInTheDocument();
            expect(mockOnLogin).not.toHaveBeenCalled();
        });
    });
});
