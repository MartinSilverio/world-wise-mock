import { ReactNode, useEffect } from 'react';
import { useAuth } from '../contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    //Because useEffect occurs after render, it's rendering children first, when it shouldn't
    //Check isAuthenticated and return null if it isn't
    return isAuthenticated ? children : null;
}

export default ProtectedRoute;
