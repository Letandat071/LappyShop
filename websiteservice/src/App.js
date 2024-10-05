import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes/index'; 
import DefaultComponent from './components/DefaultComponent';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import 'flowbite/dist/flowbite.min.css';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import { isAuthenticated, getCurrentUser } from './utils/auth';


export function AppContent() {
  const { isDarkMode } = useDarkMode();
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const user = getCurrentUser();
        // You can set the user in a global state here if needed
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="app-background">
      <div className="app-overlay">
        <Router>
          <Routes>
            {authState ? (
              <Route path="/admin/*" element={<AdminLayout setIsAuthenticated={setAuthState} />} />
            ) : (
              <Route path="/admin/login" element={<AdminLogin setIsAuthenticated={setAuthState} />} />
            )}
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultComponent : React.Fragment;
              if (route.children) {
                return (
                  <Route key={route.path} path={route.path} element={<Layout><Page /></Layout>}>
                    {route.children.map((childRoute) => (
                      <Route
                        key={childRoute.path || 'index'}
                        index={childRoute.index}
                        path={childRoute.path}
                        element={childRoute.element}
                      />
                    ))}
                  </Route>
                );
              }
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export function App() {
  useEffect(() => {
    const checkAuth = () => {
      if (localStorage.getItem('rememberMe') === 'true' && isAuthenticated()) {
        // Người dùng đã chọn "Ghi nhớ đăng nhập" và đã được xác thực
        // Bạn có thể thực hiện các hành động bổ sung ở đây nếu cần
      }
    };

    checkAuth();
  }, []);

  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;
