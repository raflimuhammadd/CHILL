import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../features/auth/store/authStore';

function ProtectedRoute({ children }) {
     const user = useAuthStore(((state) => state.user));
     const initialized = useAuthStore((state) => state.initialized);
     const location = useLocation();

     if (!initialized) {
        return (
            <div className="min-h-screen bg-chill-dark flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-chill-gray border-t-transparent rounded-full"/>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;