import { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setSuccessMsg('');

    try {
      const response = await fetch('https://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setRegisterError(errorData.error || 'Registration failed');
      } else {
        setSuccessMsg('User registered! You can now login.');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setRegisterError('Network error');
    }
  };

  return (
    <div className="register-container">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} required onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} required onChange={e => setPassword(e.target.value)} />
        </div>

        {registerError && <p className="error">{registerError}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
