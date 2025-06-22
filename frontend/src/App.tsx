import { useState, useEffect } from 'react';
import { Login } from './Login';
import Register from './Register';
import { ProductList } from './ProductList';
import './Login.css';
import TopNavBar from './TopNavBar';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setToken(null);
    setShowLogin(true);
  };

  return (
    <>
      {token && <TopNavBar token={token} onLogout={handleLogout} />}
      {!token ? (
        <div className="login-container">
          <div className="login-tabs">
            <button
              className={showLogin ? 'active' : ''}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className={!showLogin ? 'active' : ''}
              onClick={() => setShowLogin(false)}
            >
              Register
            </button>
          </div>

          {showLogin ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Register />
          )}
        </div>
      ) : (
        <ProductList token={token} />
      )}

      {/* Footer */}
      <footer
        style={{
          marginTop: '2rem',
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: '#f0f0f0',
          borderTop: '1px solid #ccc',
          fontSize: '0.9rem',
          color: '#555',
        }}
      >
        &copy; {new Date().getFullYear()} Mi Aplicación - Todos los derechos reservados
      </footer>
    </>
  );
}

export default App;
