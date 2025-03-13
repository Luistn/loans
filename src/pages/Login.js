import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import './Login.css';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError('E-mail ou senha inválidos');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (err) {
      setError('Erro ao logar com o Google');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
      
        <h2>Login</h2>
        {error && <p className="login-error">{error}</p>}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        <button type="button" className="google-btn" onClick={handleGoogleLogin}>
          Entrar com Google
        </button>
        <div className="signup-link">
          <p>Ainda não tem uma conta? <Link to="/signup">Cadastre-se aqui</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
