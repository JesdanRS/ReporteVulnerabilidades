import { Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, FileText, PlusCircle } from "lucide-react";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Shield size={32} />
          <h1>Gestión de Riesgos</h1>
        </div>

        <div className="navbar-nav">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            to="/riesgos"
            className={`nav-link ${isActive("/riesgos") ? "active" : ""}`}
          >
            <FileText size={18} />
            Riesgos
          </Link>
          <Link
            to="/nuevo"
            className={`nav-link ${isActive("/nuevo") ? "active" : ""}`}
          >
            <PlusCircle size={18} />
            Nuevo Riesgo
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
