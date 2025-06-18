import { useState, useEffect } from 'react';
import {Login} from './Login';
import Register from './Register';
import { ProductList } from './ProductList';
import './Login.css';

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
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <>
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
        <ProductList token={token} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
