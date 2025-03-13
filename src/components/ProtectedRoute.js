import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  // Se o usuário não estiver logado, redireciona para o login
  if (!user) {
    return <Navigate to="/" />;
  }

  // Caso contrário, exibe os filhos da rota (a página protegida)
  return children;
};

export default ProtectedRoute;
