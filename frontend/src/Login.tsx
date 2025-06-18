import { useState } from 'react';
import './login.css';

type LoginProps = {
  onLoginSuccess: (token: string) => void;
};

export function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('https://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await res.json();
      onLoginSuccess(data.token);
    } catch (error: any) {
      setLoginError(error.message || 'Error en login');
    }
  };

  return (
    <div className="login-container">
        <h1>Acceso a tu cuenta</h1>
        <form onSubmit={handleLogin}>
            <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>

            <div>
            <label>Contraseña:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            {loginError && <p className="error">{loginError}</p>}

            <button type="submit">Iniciar sesión</button>
        </form>
    </div>
  );
}
