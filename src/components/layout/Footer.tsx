import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          <div className="flex items-center mb-4 md:mb-0">
            <Car className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
            <span className="text-xl font-bold text-white">Espace Réservation</span>
          </div>
          
          <nav aria-label="Liens de pied de page" className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Accueil</Link>
            <Link to="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors">Mentions légales</Link>
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link>
          </nav>

          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Espace Réservation.</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}