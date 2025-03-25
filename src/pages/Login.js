import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import './Login.css';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailParaRecuperacao, setEmailParaRecuperacao] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

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

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, emailParaRecuperacao);
      setSuccessMessage('E-mail de recuperação enviado. Verifique sua caixa de entrada.');
      setEmailParaRecuperacao('');
      setShowRecoveryForm(false);
    } catch (err) {
      setError('Erro ao enviar e-mail de recuperação');
    }
  };

  const handleShowRecoveryForm = () => {
    setShowRecoveryForm(true);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          {error && <p className="login-error">{error}</p>}
          {successMessage && <p className="login-success">{successMessage}</p>}

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

          <div className="recuperar-senha-link">
            <p>
              <span
                className="link-recuperacao-senha"
                onClick={handleShowRecoveryForm}
              >
                Esqueceu sua senha?
              </span>
            </p>
          </div>

          {showRecoveryForm && (
            <form onSubmit={handlePasswordRecovery} className="recuperacao-form">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={emailParaRecuperacao}
                onChange={(e) => setEmailParaRecuperacao(e.target.value)}
                required
              />
              <button type="submit">Enviar link de recuperação</button>
            </form>
          )}

          <div className="signup-link">
            <p>Ainda não tem uma conta? <Link to="/signup" className="link-cadastro">Cadastre-se aqui</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
