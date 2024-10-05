import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const getToken = () => {
  return Cookies.get('AdminToken') || localStorage.getItem('AdminToken');
};

const setToken = (token) => {
  Cookies.set('AdminToken', token, { expires: 2, path: '/' });
  localStorage.setItem('AdminToken', token);
};

const removeToken = () => {
  Cookies.remove('AdminToken');
  localStorage.removeItem('AdminToken');
};

const authMiddleware = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const token = getToken();
        // console.log('Checking auth, token:', token);

        if (!token) {
          console.log('No token found, setting isAuthenticated to false');
          setIsAuthenticated(false);
          setIsLoading(false);
          if (location.pathname !== '/admin/login') {
            console.log('Redirecting to login');
            navigate('/admin/login', { replace: true });
          }
        } else {
          try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            console.log('Token expiration:', decodedToken.exp, 'Current time:', currentTime);
    
            if (decodedToken.exp < currentTime) {
              console.log('Token expired, removing token and setting isAuthenticated to false');
              removeToken();
              setIsAuthenticated(false);
              setIsLoading(false);
              navigate('/admin/login', { replace: true });
            } else {
              console.log('Token valid, setting isAuthenticated to true');
              setIsAuthenticated(true);
              setIsLoading(false);
              if (location.pathname === '/admin/login') {
                navigate('/admin', { replace: true });
              }
            }
          } catch (error) {
            console.error('Token không hợp lệ:', error);
            removeToken();
            setIsAuthenticated(false);
            setIsLoading(false);
            navigate('/admin/login', { replace: true });
          }
        }
      };
    
      checkAuth();
    }, [navigate, location]);

    if (isLoading) {
      return <div>Đang tải...</div>;
    }

    return <WrappedComponent {...props} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />;
  };
};

export default authMiddleware;
