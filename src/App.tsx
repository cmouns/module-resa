import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import VehiculeDetail from "./pages/VehiculeDetail";
import DashboardClient from "./pages/DashboardClient";
import MentionsLegales from "./pages/MentionsLegales";
import ProtectedAdminRoute, {
  ProtectedClientRoute,
} from "./components/auth/ProtectedAdminRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <DashboardAdmin />
                  </ProtectedAdminRoute>
                }
              />{" "}
              <Route path="/vehicule/:id" element={<VehiculeDetail />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedClientRoute>
                    <DashboardClient />
                  </ProtectedClientRoute>
                }
              />{" "}
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
