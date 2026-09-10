import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Button from "../../components/UI/Button";
import Loading from "../../components/UI/Loading";
import { createOwner, fetchMyOwners } from "../../services/ownersService";
import { ApiError } from "../../services/api";
import { useAuth } from "../../context/useAuth";
import type { Owner, OwnerType } from "../../types/owner";
import { ownerTypeLabel, roleLabel } from "../../types/owner";
import "../WorkspacePage.css";

interface OwnerFormData {
  name: string;
  type: OwnerType;
  description: string;
  website: string;
  email: string;
}

const initialFormData: OwnerFormData = {
  name: "",
  type: "company",
  description: "",
  website: "",
  email: "",
};

const MyOwnersPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [owners, setOwners] = useState<
    Array<{ owner: Owner; membership: { role: "owner_admin" | "owner_editor" | "owner_viewer" } }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<OwnerFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [creationFailed, setCreationFailed] = useState(false);
  const creationInFlight = useRef(false);

  const loadOwners = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCreationFailed(false);
    try {
      setOwners(await fetchMyOwners());
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar tus perfiles de proveedor."
      );
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    void loadOwners();
  }, [loadOwners]);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const createProfile = async () => {
    if (creationInFlight.current) return;

    creationInFlight.current = true;
    setSaving(true);
    setError(null);
    setCreationFailed(false);
    setSuccess(null);

    try {
      const owner = await createOwner({
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        website: formData.website.trim() || undefined,
        email: formData.email.trim() || undefined,
      });
      setFormData(initialFormData);
      setShowCreate(false);
      setSuccess("Perfil de proveedor creado. Ya tienes el rol de Administrador.");
      navigate(`/owners/${owner._id}`);
    } catch (requestError) {
      setCreationFailed(true);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear el perfil de proveedor."
      );
    } finally {
      creationInFlight.current = false;
      setSaving(false);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createProfile();
  };

  return (
    <div className="workspace-page">
      <AppHeader />
      <main className="workspace-content">
        <div className="workspace-heading">
          <div>
            <span className="workspace-eyebrow">Proveer datos</span>
            <h1>Mis perfiles de proveedor</h1>
            <p>Administra los perfiles desde los que publicas datasets.</p>
          </div>
          <Button onClick={() => setShowCreate((current) => !current)}>
            {showCreate ? "Cancelar" : "Crear perfil de proveedor"}
          </Button>
        </div>

        {success && (
          <div className="workspace-message workspace-message--success" role="status">
            {success}
          </div>
        )}
        {error && (
          <div className="workspace-message workspace-message--error" role="alert">
            {error}
            <button
              type="button"
              className="workspace-retry"
              onClick={() => void (creationFailed ? createProfile() : loadOwners())}
              disabled={saving}
            >
              Reintentar
            </button>
          </div>
        )}

        {showCreate && (
          <section className="workspace-card workspace-card--spaced" aria-labelledby="create-owner-title">
            <div className="workspace-card__header">
              <h2 id="create-owner-title">Nuevo perfil de proveedor</h2>
              <p>Al crearlo, tu cuenta recibirá automáticamente el rol de Administrador.</p>
            </div>
            <form className="workspace-form" onSubmit={handleCreate}>
              <div className="workspace-form__row">
                <div className="workspace-field">
                  <label htmlFor="owner-name">Nombre</label>
                  <input id="owner-name" name="name" value={formData.name} onChange={handleFormChange} required />
                </div>
                <div className="workspace-field">
                  <label htmlFor="owner-type">Tipo</label>
                  <select id="owner-type" name="type" value={formData.type} onChange={handleFormChange}>
                    <option value="company">Empresa</option>
                    <option value="individual">Persona</option>
                  </select>
                </div>
              </div>
              <div className="workspace-field">
                <label htmlFor="owner-description">Descripción</label>
                <textarea id="owner-description" name="description" value={formData.description} onChange={handleFormChange} placeholder="Describe a este proveedor" />
              </div>
              <div className="workspace-form__row">
                <div className="workspace-field">
                  <label htmlFor="owner-website">Sitio web (opcional)</label>
                  <input id="owner-website" name="website" type="url" value={formData.website} onChange={handleFormChange} placeholder="https://" />
                </div>
                <div className="workspace-field">
                  <label htmlFor="owner-email">Correo (opcional)</label>
                  <input id="owner-email" name="email" type="email" value={formData.email} onChange={handleFormChange} />
                </div>
              </div>
              <div className="workspace-inline-actions">
                <Button type="submit" loading={saving}>Crear perfil de proveedor</Button>
                <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="workspace-state"><Loading size="lg" text="Cargando tus perfiles de proveedor..." /></div>
        ) : owners.length === 0 ? (
          <div className="workspace-empty">
            <h2>Aún no administras ningún perfil de proveedor</h2>
            <p>Crea un perfil de proveedor para empezar a gestionar y publicar datasets.</p>
            {!showCreate && <Button onClick={() => setShowCreate(true)}>Crear mi primer perfil de proveedor</Button>}
          </div>
        ) : (
          <div className="owner-grid">
            {owners.map(({ owner, membership }) => (
              <Link className="owner-card" to={`/owners/${owner._id}`} key={owner._id}>
                <span className="owner-card__type">{ownerTypeLabel(owner.type)}</span>
                <h2>{owner.name}</h2>
                <p>{owner.description || "Sin descripción"}</p>
                <span className="owner-card__role">{roleLabel(membership.role)}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOwnersPage;
