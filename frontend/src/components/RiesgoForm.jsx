import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, AlertCircle, CheckCircle, Info } from "lucide-react";
import { riesgoService } from "../services/api";

const CATEGORIAS = [
  "Operacional",
  "Tecnológico",
  "Legal",
  "Financiero",
  "Reputacional",
  "Seguridad Física",
  "Ciberseguridad",
];

const ESTADOS = [
  "Identificado",
  "En análisis",
  "En tratamiento",
  "Mitigado",
  "Cerrado",
];

const calcularNivelRiesgo = (probabilidad, impacto) => {
  const valor = probabilidad * impacto;
  if (valor <= 4) return { nivel: "Bajo", valor };
  if (valor <= 9) return { nivel: "Medio", valor };
  if (valor <= 15) return { nivel: "Alto", valor };
  return { nivel: "Crítico", valor };
};

function RiesgoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    probabilidad: 1,
    impacto: 1,
    consecuencias: "",
    planAccion: "",
    fechaIdentificacion: new Date().toISOString().split("T")[0],
    fechaLimite: "",
    responsable: "",
    estado: "Identificado",
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchRiesgo();
    }
  }, [id]);

  const fetchRiesgo = async () => {
    try {
      setLoading(true);
      const response = await riesgoService.getById(id);
      const riesgo = response.data;
      setFormData({
        titulo: riesgo.titulo || "",
        descripcion: riesgo.descripcion || "",
        categoria: riesgo.categoria || "",
        probabilidad: riesgo.probabilidad || 1,
        impacto: riesgo.impacto || 1,
        consecuencias: riesgo.consecuencias || "",
        planAccion: riesgo.planAccion || "",
        fechaIdentificacion: riesgo.fechaIdentificacion?.split("T")[0] || "",
        fechaLimite: riesgo.fechaLimite?.split("T")[0] || "",
        responsable: riesgo.responsable || "",
        estado: riesgo.estado || "Identificado",
        observaciones: riesgo.observaciones || "",
      });
    } catch (err) {
      setError("Error al cargar el riesgo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "probabilidad" || name === "impacto"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación básica
    if (
      !formData.titulo ||
      !formData.descripcion ||
      !formData.categoria ||
      !formData.consecuencias ||
      !formData.planAccion ||
      !formData.responsable
    ) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await riesgoService.update(id, formData);
        setSuccess("Riesgo actualizado exitosamente");
      } else {
        await riesgoService.create(formData);
        setSuccess("Riesgo creado exitosamente");
      }

      setTimeout(() => {
        navigate("/riesgos");
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Error al guardar el riesgo";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const { nivel, valor } = calcularNivelRiesgo(
    formData.probabilidad,
    formData.impacto
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando riesgo...</p>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? "Editar Riesgo" : "Registrar Nuevo Riesgo"}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? "Modifica la información del riesgo seleccionado"
            : "Complete el formulario para registrar un nuevo evento de riesgo"}
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Información del Riesgo</h3>
          </div>

          <div className="form-grid">
            {/* Título */}
            <div className="form-group full-width">
              <label className="form-label">
                Título del Riesgo <span className="required">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Acceso no autorizado a servidores de producción"
                required
              />
            </div>

            {/* Descripción */}
            <div className="form-group full-width">
              <label className="form-label">
                Descripción del Riesgo <span className="required">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe detalladamente el riesgo identificado..."
                rows={3}
                required
              />
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label className="form-label">
                Categoría <span className="required">*</span>
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div className="form-group">
              <label className="form-label">
                Estado <span className="required">*</span>
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="form-select"
                required
              >
                {ESTADOS.map((est) => (
                  <option key={est} value={est}>
                    {est}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Análisis de Riesgo */}
        <div className="card mt-6">
          <div className="card-header">
            <h3 className="card-title">Análisis de Riesgo</h3>
          </div>

          <div className="form-grid">
            {/* Probabilidad */}
            <div className="form-group">
              <label className="form-label">
                Probabilidad (1-5) <span className="required">*</span>
              </label>
              <select
                name="probabilidad"
                value={formData.probabilidad}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value={1}>1 - Muy Baja (Raro)</option>
                <option value={2}>2 - Baja (Improbable)</option>
                <option value={3}>3 - Media (Posible)</option>
                <option value={4}>4 - Alta (Probable)</option>
                <option value={5}>5 - Muy Alta (Casi seguro)</option>
              </select>
            </div>

            {/* Impacto */}
            <div className="form-group">
              <label className="form-label">
                Impacto (1-5) <span className="required">*</span>
              </label>
              <select
                name="impacto"
                value={formData.impacto}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value={1}>1 - Insignificante</option>
                <option value={2}>2 - Menor</option>
                <option value={3}>3 - Moderado</option>
                <option value={4}>4 - Mayor</option>
                <option value={5}>5 - Catastrófico</option>
              </select>
            </div>

            {/* Indicador de Nivel de Riesgo */}
            <div className="form-group full-width">
              <label className="form-label">
                <Info size={16} />
                Nivel de Riesgo Calculado
              </label>
              <div className="risk-level-indicator">
                <div className={`risk-level-value ${nivel.toLowerCase()}`}>
                  {valor}
                </div>
                <div className="risk-level-info">
                  <div className="risk-level-label">Probabilidad × Impacto</div>
                  <div className={`risk-level-name`}>
                    <span
                      className={`badge badge-${nivel.toLowerCase()}`}
                      style={{ fontSize: "1rem" }}
                    >
                      {nivel}
                    </span>
                  </div>
                </div>
                <div className="risk-formula">
                  <span className="text-muted text-small">
                    {formData.probabilidad} × {formData.impacto} = {valor}
                  </span>
                </div>
              </div>
            </div>

            {/* Consecuencias */}
            <div className="form-group full-width">
              <label className="form-label">
                Consecuencias <span className="required">*</span>
              </label>
              <textarea
                name="consecuencias"
                value={formData.consecuencias}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe las posibles consecuencias si este riesgo se materializa..."
                rows={3}
                required
              />
            </div>

            {/* Plan de Acción */}
            <div className="form-group full-width">
              <label className="form-label">
                Plan de Acción <span className="required">*</span>
              </label>
              <textarea
                name="planAccion"
                value={formData.planAccion}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Define las acciones a tomar para mitigar o eliminar este riesgo..."
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Responsable y Fechas */}
        <div className="card mt-6">
          <div className="card-header">
            <h3 className="card-title">Asignación y Seguimiento</h3>
          </div>

          <div className="form-grid">
            {/* Responsable */}
            <div className="form-group">
              <label className="form-label">
                Responsable <span className="required">*</span>
              </label>
              <input
                type="text"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                className="form-input"
                placeholder="Nombre del responsable"
                required
              />
            </div>

            {/* Fecha de Identificación */}
            <div className="form-group">
              <label className="form-label">
                Fecha de Identificación <span className="required">*</span>
              </label>
              <input
                type="date"
                name="fechaIdentificacion"
                value={formData.fechaIdentificacion}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Fecha Límite */}
            <div className="form-group">
              <label className="form-label">Fecha Límite para Mitigación</label>
              <input
                type="date"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Observaciones */}
            <div className="form-group full-width">
              <label className="form-label">Observaciones Adicionales</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Notas adicionales o información complementaria..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="card mt-6">
          <div className="btn-group" style={{ justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/riesgos")}
              disabled={saving}
            >
              <X size={18} />
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} />
              {saving
                ? "Guardando..."
                : isEditing
                ? "Actualizar Riesgo"
                : "Registrar Riesgo"}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .risk-formula {
          margin-left: auto;
          padding-left: 1rem;
          border-left: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
}

export default RiesgoForm;
