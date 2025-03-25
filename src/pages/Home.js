import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth());
  const [novoEmprestimo, setNovoEmprestimo] = useState({
    nome: '',
    valor: '',
    juros: '',
    vencimento: '',
    pago: false
  });
  const [editarId, setEditarId] = useState(null); // Estado para identificar o empréstimo em edição

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const navigate = useNavigate();

  const carregarEmprestimos = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (!userId) return;

    const refEmprestimos = collection(db, 'loans');
    const snapshot = await getDocs(refEmprestimos);
    const listaEmprestimos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const emprestimosUsuario = listaEmprestimos.filter(emprestimo => emprestimo.userId === userId && emprestimo.mes === mes);
    setEmprestimos(emprestimosUsuario);
  };

  useEffect(() => {
    carregarEmprestimos();
  }, [mes]);

  const adicionarEmprestimo = async () => {
    if (!novoEmprestimo.valor || !novoEmprestimo.juros || !novoEmprestimo.vencimento) {
      alert('Valor, Juros e Vencimento são obrigatórios!');
      return;
    }

    const total = parseFloat(novoEmprestimo.valor) + (parseFloat(novoEmprestimo.valor) * parseFloat(novoEmprestimo.juros) / 100);
    const mesVencimento = new Date(novoEmprestimo.vencimento).getMonth();

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('Você precisa estar logado para adicionar um empréstimo.');
      return;
    }

    const userId = user.uid;

    await addDoc(collection(db, 'loans'), {
      ...novoEmprestimo,
      userId,
      mes: mesVencimento,
      total
    });

    setNovoEmprestimo({ nome: '', valor: '', juros: '', vencimento: '', pago: false });
    carregarEmprestimos();
  };

  const excluirEmprestimo = async (id) => {
    const refEmprestimo = doc(db, 'loans', id);
    const emprestimo = (await getDoc(refEmprestimo)).data();

    const user = getAuth().currentUser;
    if (emprestimo.userId === user?.uid) {
      await deleteDoc(refEmprestimo);
      carregarEmprestimos();
    } else {
      alert("Você não tem permissão para excluir este empréstimo.");
    }
  };

  const marcarComoPago = async (id) => {
    const refEmprestimo = doc(db, 'loans', id);
    const emprestimo = (await getDoc(refEmprestimo)).data();

    const user = getAuth().currentUser;
    if (emprestimo.userId === user?.uid) {
      await updateDoc(refEmprestimo, { pago: true });
      carregarEmprestimos();
    } else {
      alert("Você não tem permissão para marcar este empréstimo como pago.");
    }
  };

  const marcarJurosPago = async (id) => {
    const refEmprestimo = doc(db, 'loans', id);
    const dadosEmprestimo = (await getDoc(refEmprestimo)).data();

    const user = getAuth().currentUser;
    if (dadosEmprestimo.userId === user?.uid) {
      const novaData = new Date(dadosEmprestimo.vencimento);
      novaData.setMonth(novaData.getMonth() + 1);

      await addDoc(collection(db, 'loans'), {
        ...dadosEmprestimo,
        mes: novaData.getMonth(),
        vencimento: novaData.toISOString().split('T')[0],
        pago: false
      });

      await updateDoc(refEmprestimo, { pago: true });
      carregarEmprestimos();
    } else {
      alert("Você não tem permissão para marcar juros como pagos.");
    }
  };

  const editarEmprestimo = (id) => {
    const emprestimo = emprestimos.find((emprestimo) => emprestimo.id === id);
    setNovoEmprestimo({
      nome: emprestimo.nome,
      valor: emprestimo.valor,
      juros: emprestimo.juros,
      vencimento: emprestimo.vencimento,
      pago: emprestimo.pago
    });
    setEditarId(id);  // Define o id do empréstimo em edição
  };

  const salvarEdicao = async () => {
    // Calcular o total baseado no valor e juros
    const total = parseFloat(novoEmprestimo.valor) + (parseFloat(novoEmprestimo.valor) * parseFloat(novoEmprestimo.juros) / 100);

    const refEmprestimo = doc(db, 'loans', editarId);
    await updateDoc(refEmprestimo, {
      nome: novoEmprestimo.nome,
      valor: novoEmprestimo.valor,
      juros: novoEmprestimo.juros,
      vencimento: novoEmprestimo.vencimento,
      total: total,  // Atualizando o total após recalcular
    });

    // Limpar os estados após salvar a edição
    setEditarId(null);
    setNovoEmprestimo({ nome: '', valor: '', juros: '', vencimento: '', pago: false });

    // Recarregar os empréstimos
    carregarEmprestimos();
  };

  const calcularTotalMes = () => {
    return emprestimos.reduce((total, emprestimo) => total + emprestimo.total, 0).toFixed(2);
  };

  const calcularDiasRestantes = (vencimento) => {
    const hoje = new Date();
    const dataVencimento = new Date(vencimento);
    const diferenca = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
    return diferenca > 0 ? `${diferenca} dias` : 'Vencido';
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);  // Efetua o logout
      navigate('/login');   // Redireciona para a página de login
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div className="pagina-principal">
      <div className="navegacao-meses">
        <button onClick={() => setMes((mes - 1 + 12) % 12)}>&lt;</button>
        <h2>{meses[mes]}</h2>
        <button onClick={() => setMes((mes + 1) % 12)}>&gt;</button>
      </div>

      {/* Divisão dos botões "Minha Conta" e "Sair" */}
      <div className="minha-conta-container">
        <button className="minha-conta" onClick={() => navigate('/minha-conta')}>Minha Conta</button>
        <button className="sair" onClick={handleLogout}>Sair</button>
      </div>

      <div className="formulario-emprestimo">
        <input type="text" placeholder="Nome" value={novoEmprestimo.nome}
          onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, nome: e.target.value })} />
        <input type="number" placeholder="Valor" value={novoEmprestimo.valor}
          onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, valor: e.target.value })} />
        <input type="number" placeholder="Juros (%)" value={novoEmprestimo.juros}
          onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, juros: e.target.value })} />
        <input type="date" placeholder="Vencimento" value={novoEmprestimo.vencimento}
          onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, vencimento: e.target.value })} />
        <button onClick={editarId ? salvarEdicao : adicionarEmprestimo}>
          {editarId ? 'Salvar Edição' : 'Adicionar'}
        </button>
      </div>

      <table className="tabela-emprestimos">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valor</th>
            <th>Juros</th>
            <th>Total</th>
            <th>Vencimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {emprestimos.sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento)).map((emprestimo) => (
            <tr key={emprestimo.id} className={emprestimo.pago ? 'riscado' : ''}>
              <td>{emprestimo.nome}</td>
              <td>{emprestimo.valor}</td>
              <td>{emprestimo.juros}%</td>
              <td>{emprestimo.total}</td>
              <td>
                {emprestimo.vencimento}
                <small className="contador-dias">
                  ({calcularDiasRestantes(emprestimo.vencimento)})
                </small>
              </td>
              <td>
                <button onClick={() => marcarComoPago(emprestimo.id)}>PG</button>
                <button onClick={() => marcarJurosPago(emprestimo.id)}>Juros Pg</button>
                <button onClick={() => editarEmprestimo(emprestimo.id)}><span role="img" aria-label="editar">✏️</span></button>
                <button onClick={() => excluirEmprestimo(emprestimo.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-mes">Total do Mês: R$ {calcularTotalMes()}</div>
      
    </div>
  );
};

export default Home;
