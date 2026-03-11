import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Navbar from './components/layout/Navbar';
import Catalogue from './pages/Catalogue';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Si l'URL est /, on affiche le Catalogue */}
            <Route path="/" element={<Catalogue />} />
            {/* Si l'URL est /login, on affiche le Login */}
            <Route path="/login" element={<Login />} />
            {/* Si l'URL est /register, on affiche le Register */}
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}