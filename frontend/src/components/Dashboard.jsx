import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { riesgoService } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await riesgoService.getStats();
      setStats(response.data);
    } catch (err) {
      setError("Error al cargar las estadísticas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const porNivel = stats?.porNivel || {};
  const porEstado = stats?.porEstado || {};

  return (
    <div className="main-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard de Riesgos</h1>
        <p className="page-subtitle">
          Resumen general del estado de los riesgos de seguridad
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Shield size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalRiesgos || 0}</div>
            <div className="stat-label">Total de Riesgos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon critico">
            <AlertTriangle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{porNivel["Crítico"] || 0}</div>
            <div className="stat-label">Riesgos Críticos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon alto">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.riesgosAltos || 0}</div>
            <div className="stat-label">Altos/Críticos Activos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon activo">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{porEstado["Mitigado"] || 0}</div>
            <div className="stat-label">Riesgos Mitigados</div>
          </div>
        </div>
      </div>

      {/* Grid de información */}
      <div className="form-grid">
        {/* Distribución por Nivel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Distribución por Nivel</h3>
          </div>
          <div className="risk-distribution">
            {["Bajo", "Medio", "Alto", "Crítico"].map((nivel) => (
              <div key={nivel} className="risk-bar-item">
                <div className="flex justify-between items-center mb-2">
                  <span className={`badge badge-${nivel.toLowerCase()}`}>
                    {nivel}
                  </span>
                  <span className="text-small">{porNivel[nivel] || 0}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${nivel.toLowerCase()}`}
                    style={{
                      width: `${
                        stats?.totalRiesgos
                          ? ((porNivel[nivel] || 0) / stats.totalRiesgos) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Estado */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Distribución por Estado</h3>
          </div>
          <div className="status-list">
            {[
              "Identificado",
              "En análisis",
              "En tratamiento",
              "Mitigado",
              "Cerrado",
            ].map((estado) => (
              <div key={estado} className="status-item">
                <span
                  className={`badge badge-${estado
                    .toLowerCase()
                    .replace(" ", "-")
                    .replace("á", "a")}`}
                >
                  {estado}
                </span>
                <span className="status-count">{porEstado[estado] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Riesgos próximos a vencer */}
      {stats?.proximosVencer && stats.proximosVencer.length > 0 && (
        <div className="card mt-6">
          <div className="card-header">
            <h3 className="card-title">
              <Clock
                size={20}
                style={{ marginRight: "8px", display: "inline" }}
              />
              Próximos a Vencer (7 días)
            </h3>
            <Link to="/riesgos" className="btn btn-secondary">
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Nivel</th>
                  <th>Fecha Límite</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {stats.proximosVencer.map((riesgo) => (
                  <tr key={riesgo._id}>
                    <td>{riesgo.titulo}</td>
                    <td>
                      <span
                        className={`badge badge-${riesgo.nivelRiesgo?.toLowerCase()}`}
                      >
                        {riesgo.nivelRiesgo}
                      </span>
                    </td>
                    <td>
                      {new Date(riesgo.fechaLimite).toLocaleDateString("es-ES")}
                    </td>
                    <td>{riesgo.responsable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state si no hay datos */}
      {stats?.totalRiesgos === 0 && (
        <div className="card mt-6">
          <div className="empty-state">
            <Shield size={64} />
            <h3>No hay riesgos registrados</h3>
            <p>Comienza agregando tu primer riesgo de seguridad</p>
            <Link to="/nuevo" className="btn btn-primary">
              Registrar Primer Riesgo
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .risk-distribution {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .risk-bar-item {
          padding: 0.5rem 0;
        }
        
        .progress-bar {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.5s ease;
        }
        
        .progress-fill.bajo { background: var(--riesgo-bajo); }
        .progress-fill.medio { background: var(--riesgo-medio); }
        .progress-fill.alto { background: var(--riesgo-alto); }
        .progress-fill.crítico { background: var(--riesgo-critico); }
        
        .status-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--bg-input);
          border-radius: var(--radius-md);
        }
        
        .status-count {
          font-size: 1.25rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
