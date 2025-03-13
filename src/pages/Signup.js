import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError('Erro ao criar a conta');
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <form onSubmit={handleSignup} className="signup-form">
          <h2>Cadastre-se</h2>
          {error && <p className="signup-error">{error}</p>}
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
          <button type="submit">Cadastrar</button>
        </form>
        <button className="go-to-login" onClick={handleGoToLogin}>
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
