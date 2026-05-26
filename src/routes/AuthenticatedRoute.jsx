import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const loginState = useSelector((state) => state.login);
  const { isLoggedIn, isInitialized } = loginState || { isLoggedIn: false, isInitialized: false };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 font-medium">사용자 확인 중...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/unauthenticated" replace />;
  }

  return children;
};

export default AuthenticatedRoute;