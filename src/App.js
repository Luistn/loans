import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import MinhaConta from './pages/Minhaconta';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route path="/" element={<Login />} />

        {/* Rota de cadastro */}
        <Route path="/signup" element={<Signup />} />

        {/* Rota protegida com ProtectedRoute */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Rota da página Minha Conta */}
        <Route
          path="/minha-conta"
          element={
            <ProtectedRoute>
              <MinhaConta />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
