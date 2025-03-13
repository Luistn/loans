import React, { useState } from 'react';
import { getAuth, updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const MinhaConta = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleAlterarSenha = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && novaSenha) {
      try {
        await updatePassword(user, novaSenha);
        alert('Senha alterada com sucesso!');
        navigate('/home');  // Redireciona para a página inicial
      } catch (error) {
        setErro('Erro ao alterar senha: ' + error.message);
      }
    } else {
      setErro('Por favor, insira uma nova senha');
    }
  };

  return (
    <div className="minha-conta">
      <h2>Minha Conta</h2>
      <input 
        type="password" 
        placeholder="Nova Senha" 
        value={novaSenha} 
        onChange={(e) => setNovaSenha(e.target.value)} 
      />
      <button onClick={handleAlterarSenha}>Alterar Senha</button>
      {erro && <p>{erro}</p>}
    </div>
  );
};

export default MinhaConta;
