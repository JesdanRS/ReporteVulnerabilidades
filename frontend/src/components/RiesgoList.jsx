import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Edit2,
  Trash2,
  Eye,
  Plus,
  Search,
  AlertCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import { riesgoService } from "../services/api";

function RiesgoList() {
  const [riesgos, setRiesgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    estado: "",
    nivelRiesgo: "",
    categoria: "",
  });
  const [selectedRiesgo, setSelectedRiesgo] = useState(null);

  useEffect(() => {
    fetchRiesgos();
  }, [filters]);

  const fetchRiesgos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.estado) params.estado = filters.estado;
      if (filters.nivelRiesgo) params.nivelRiesgo = filters.nivelRiesgo;
      if (filters.categoria) params.categoria = filters.categoria;

      const response = await riesgoService.getAll(params);
      setRiesgos(response.data || []);
    } catch (err) {
      setError("Error al cargar los riesgos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ estado: "", nivelRiesgo: "", categoria: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este riesgo?")) return;

    try {
      setDeleteId(id);
      await riesgoService.delete(id);
      setRiesgos((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError("Error al eliminar el riesgo");
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="main-container">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Registro de Riesgos</h1>
          <p className="page-subtitle">
            Gestiona y monitorea todos los riesgos de seguridad
          </p>
        </div>
        <Link to="/nuevo" className="btn btn-primary">
          <Plus size={18} />
          Nuevo Riesgo
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="filter-group">
          <label className="filter-label">
            <Filter size={14} />
            Estado
          </label>
          <select
            name="estado"
            value={filters.estado}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="Identificado">Identificado</option>
            <option value="En análisis">En análisis</option>
            <option value="En tratamiento">En tratamiento</option>
            <option value="Mitigado">Mitigado</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Nivel</label>
          <select
            name="nivelRiesgo"
            value={filters.nivelRiesgo}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Categoría</label>
          <select
            name="categoria"
            value={filters.categoria}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Todas</option>
            <option value="Operacional">Operacional</option>
            <option value="Tecnológico">Tecnológico</option>
            <option value="Legal">Legal</option>
            <option value="Financiero">Financiero</option>
            <option value="Reputacional">Reputacional</option>
            <option value="Seguridad Física">Seguridad Física</option>
            <option value="Ciberseguridad">Ciberseguridad</option>
          </select>
        </div>

        <button className="btn btn-secondary" onClick={clearFilters}>
          <RefreshCw size={16} />
          Limpiar
        </button>

        <div style={{ marginLeft: "auto" }} className="text-muted text-small">
          {riesgos.length} riesgo(s) encontrado(s)
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando riesgos...</p>
        </div>
      ) : riesgos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Search size={64} />
            <h3>No se encontraron riesgos</h3>
            <p>
              {filters.estado || filters.nivelRiesgo || filters.categoria
                ? "Intenta con otros filtros o limpia la búsqueda"
                : "Comienza registrando tu primer riesgo de seguridad"}
            </p>
            <Link to="/nuevo" className="btn btn-primary">
              <Plus size={18} />
              Registrar Riesgo
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Nivel</th>
                  <th>Estado</th>
                  <th>Responsable</th>
                  <th>Fecha Límite</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {riesgos.map((riesgo) => (
                  <tr key={riesgo._id}>
                    <td>
                      <div className="truncate" title={riesgo.titulo}>
                        {riesgo.titulo}
                      </div>
                    </td>
                    <td>{riesgo.categoria}</td>
                    <td>
                      <span
                        className={`badge badge-${riesgo.nivelRiesgo?.toLowerCase()}`}
                      >
                        {riesgo.nivelRiesgo}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-${riesgo.estado
                          ?.toLowerCase()
                          .replace(" ", "-")
                          .replace("á", "a")}`}
                      >
                        {riesgo.estado}
                      </span>
                    </td>
                    <td>{riesgo.responsable}</td>
                    <td>{formatDate(riesgo.fechaLimite)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn-icon"
                          onClick={() => setSelectedRiesgo(riesgo)}
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <Link
                          to={`/editar/${riesgo._id}`}
                          className="btn-icon"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(riesgo._id)}
                          disabled={deleteId === riesgo._id}
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedRiesgo && (
        <div className="modal-overlay" onClick={() => setSelectedRiesgo(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detalles del Riesgo</h3>
              <button
                className="btn-icon"
                onClick={() => setSelectedRiesgo(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label>Título</label>
                  <p>{selectedRiesgo.titulo}</p>
                </div>

                <div className="detail-item full-width">
                  <label>Descripción</label>
                  <p>{selectedRiesgo.descripcion}</p>
                </div>

                <div className="detail-item">
                  <label>Categoría</label>
                  <p>{selectedRiesgo.categoria}</p>
                </div>

                <div className="detail-item">
                  <label>Estado</label>
                  <p>
                    <span
                      className={`badge badge-${selectedRiesgo.estado
                        ?.toLowerCase()
                        .replace(" ", "-")
                        .replace("á", "a")}`}
                    >
                      {selectedRiesgo.estado}
                    </span>
                  </p>
                </div>

                <div className="detail-item">
                  <label>Probabilidad</label>
                  <p>{selectedRiesgo.probabilidad} / 5</p>
                </div>

                <div className="detail-item">
                  <label>Impacto</label>
                  <p>{selectedRiesgo.impacto} / 5</p>
                </div>

                <div className="detail-item">
                  <label>Nivel de Riesgo</label>
                  <p>
                    <span
                      className={`badge badge-${selectedRiesgo.nivelRiesgo?.toLowerCase()}`}
                      style={{ fontSize: "1rem" }}
                    >
                      {selectedRiesgo.nivelRiesgo} ({selectedRiesgo.valorRiesgo}
                      )
                    </span>
                  </p>
                </div>

                <div className="detail-item">
                  <label>Responsable</label>
                  <p>{selectedRiesgo.responsable}</p>
                </div>

                <div className="detail-item full-width">
                  <label>Consecuencias</label>
                  <p>{selectedRiesgo.consecuencias}</p>
                </div>

                <div className="detail-item full-width">
                  <label>Plan de Acción</label>
                  <p>{selectedRiesgo.planAccion}</p>
                </div>

                <div className="detail-item">
                  <label>Fecha Identificación</label>
                  <p>{formatDate(selectedRiesgo.fechaIdentificacion)}</p>
                </div>

                <div className="detail-item">
                  <label>Fecha Límite</label>
                  <p>{formatDate(selectedRiesgo.fechaLimite)}</p>
                </div>

                {selectedRiesgo.observaciones && (
                  <div className="detail-item full-width">
                    <label>Observaciones</label>
                    <p>{selectedRiesgo.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedRiesgo(null)}
              >
                Cerrar
              </button>
              <Link
                to={`/editar/${selectedRiesgo._id}`}
                className="btn btn-primary"
              >
                <Edit2 size={16} />
                Editar
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .detail-item.full-width {
          grid-column: 1 / -1;
        }
        
        .detail-item label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .detail-item p {
          font-size: 0.9375rem;
          color: var(--text-primary);
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default RiesgoList;
