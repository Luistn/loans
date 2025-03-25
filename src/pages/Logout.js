import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    
    // Efetua o logout
    const logout = async () => {
      try {
        await signOut(auth);
        console.log('Usuário deslogado');
        navigate('/login'); // Redireciona para a página de login após o logout
      } catch (error) {
        console.error('Erro ao fazer logout', error);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Saindo...</h2>
    </div>
  );
};

export default Logout;
