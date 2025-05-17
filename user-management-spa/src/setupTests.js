import '@testing-library/jest-dom';

// Mock for react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useParams: () => ({ id: '1' }),
}));
