// src/pages/AddEmprestimo.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './AddEmprestimo.css';

const AddEmprestimo = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [valor, setValor] = useState('');
  const [juros, setJuros] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valor || !juros || !vencimento) {
      setError('Valor, Juros e Vencimento são obrigatórios!');
      return;
    }

    const total = parseFloat(valor) + (parseFloat(valor) * parseFloat(juros) / 100);
    const mesVencimento = new Date(vencimento).getMonth();

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('Você precisa estar logado para adicionar um empréstimo.');
      return;
    }

    const userId = user.uid;

    try {
      await addDoc(collection(db, 'loans'), {
        nome,
        telefone,
        valor,
        juros,
        vencimento,
        total,
        mes: mesVencimento,
        pago: false,
        userId, // Salvando o UID do usuário
      });

      setNome('');
      setTelefone('');
      setValor('');
      setJuros('');
      setVencimento('');
      setError('');
      alert('Empréstimo cadastrado com sucesso!');
    } catch (err) {
      setError('Erro ao cadastrar o empréstimo. Tente novamente.');
    }
  };

  return (
    <div className="add-emprestimo-container">
      <h2>Cadastrar Empréstimo</h2>
      <form onSubmit={handleSubmit} className="add-emprestimo-form">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Juros (%)"
          value={juros}
          onChange={(e) => setJuros(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Vencimento"
          value={vencimento}
          onChange={(e) => setVencimento(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};


