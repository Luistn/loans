import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // Adiciona o estado de carregamento
  const [user, setUser] = useState(null); // Armazena o estado do usuário
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Atualiza o estado do usuário
      setLoading(false); // Define que o carregamento foi concluído
    });

    // Limpa o listener quando o componente for desmontado
    return () => unsubscribe();
  }, [auth]);

  // Enquanto o estado de autenticação está carregando
  if (loading) {
    return <div>Carregando...</div>; // Você pode personalizar isso, como um spinner de carregamento
  }

  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!user) {
    return <Navigate to="/" />;
  }

  // Caso contrário, renderiza a rota protegida
  return children;
};

export default ProtectedRoute;
