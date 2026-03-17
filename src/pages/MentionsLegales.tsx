import { ArrowLeft, AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MentionsLegales() {
  return (
    <main className="bg-[#F9F9F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <header className="bg-gray-900 px-8 py-6 text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Info className="mr-3 h-6 w-6 text-blue-500" aria-hidden="true" />
            Mentions Légales & RGPD
          </h1>
          <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Retour
          </Link>
        </header>

        <div className="p-8 space-y-8 text-gray-600 leading-relaxed">
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md" role="alert">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wider">Avertissement - Projet Étudiant</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Ce site n'est pas une véritable agence de location. Il s'agit d'un projet de fin d'études purement fictif. Aucune vraie réservation ne sera prise en compte et aucune véritable facturation ne sera effectuée.
                </p>
              </div>
            </div>
          </div>

          <section aria-labelledby="editeur-title">
            <h2 id="editeur-title" className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">1. Éditeur du site</h2>
            <p>Ce site a été conçu et développé par :</p>
            <ul className="mt-3 space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <li><strong className="text-gray-900">Développeur :</strong> Mounir SEBTI</li>
              <li><strong className="text-gray-900">Cursus actuel :</strong> 2ème année de BTS SIO option SLAM en distanciel.</li>
              <li><strong className="text-gray-900">Technologies utilisées :</strong> React, TypeScript, Tailwind CSS, Supabase (PostgreSQL).</li>
            </ul>
          </section>

          <section aria-labelledby="hebergement-title">
            <h2 id="hebergement-title" className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">2. Hébergement de l'application</h2>
            <p>L'architecture de ce projet est divisée en deux parties :</p>
            <ul className="mt-3 list-disc list-inside space-y-1 pl-2">
              <li>Le code Front-End (l'interface visuelle) est hébergé par <strong>Vercel Inc.</strong> (340 S Lemon Ave #4133, Walnut, CA 91789, USA).</li>
              <li>La base de données et l'authentification (Back-End) sont gérées par <strong>Supabase</strong>, dont les serveurs sont configurés pour être hébergés en Europe.</li>
            </ul>
          </section>

          <section aria-labelledby="donnees-title">
            <h2 id="donnees-title" className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">3. Traitement des données (RGPD)</h2>
            <p>
              Même s'il s'agit d'un projet scolaire, le respect de vos données est pris au sérieux. Les seules informations récoltées lors de la création d'un compte sont votre nom, prénom et adresse email.
            </p>
            <p className="mt-2">
              Ces données servent uniquement à faire fonctionner le module de réservation. Les mots de passe sont hachés et sécurisés par le service <em>Supabase Auth</em>. Je n'ai personnellement pas accès à vos mots de passe en clair.
            </p>
            <p className="mt-2">
              Vous pouvez à tout moment demander la suppression totale de votre compte de test en m'envoyant un message ou en utilisant les fonctionnalités de l'espace client.
            </p>
          </section>

          <section aria-labelledby="cookies-title">
            <h2 id="cookies-title" className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">4. Politique de Cookies</h2>
            <p>
              Vous avez sûrement remarqué l'absence de bandeau de consentement pour les cookies à votre arrivée sur le site. C'est normal ! 
            </p>
            <p className="mt-2">
              Conformément aux directives de la CNIL, ce site n'utilise <strong>aucun traceur publicitaire ou outil d'analyse d'audience</strong> (comme Google Analytics). Le seul cookie utilisé est un jeton de session technique généré par Supabase pour vous maintenir connecté de manière sécurisée. Ce cookie fonctionnel est exempté de consentement préalable.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}