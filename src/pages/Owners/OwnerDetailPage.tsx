import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Button from "../../components/UI/Button";
import Loading from "../../components/UI/Loading";
import { useAuth } from "../../context/useAuth";
import {
  archiveOwner,
  createOwnerInvitation,
  fetchOwner,
  fetchOwnerMembers,
  updateOwner,
  updateOwnerMember,
} from "../../services/ownersService";
import { getCurrentUser } from "../../services/usersService";
import { ApiError } from "../../services/api";
import {
  archiveDataset,
  createDataset,
  fetchDatasetById,
  fetchDatasets,
  updateDataset,
  type DatasetCreateData,
  type DatasetUpdateData,
} from "../../services/datasetsService";
import type {
  Owner,
  OwnerInvitationCreate,
  OwnerMembership,
  OwnerMembershipRole,
  OwnerMembershipStatus,
} from "../../types/owner";
import {
  getOwnerCapabilities,
  ownerTypeLabel,
  roleLabel,
} from "../../types/owner";
import type { DatasetWithSamples } from "../../types/dataset";
import "../WorkspacePage.css";

const DATASET_CACHE_KEY = "taloop_owner_dataset_cache";

interface OwnerFormData {
  name: string;
  type: "company" | "individual";
  description: string;
  website: string;
  email: string;
}

interface DatasetFormData {
  title: string;
  category: string;
  visibility: "public" | "unlisted" | "private";
  publicPreviewEnabled: boolean;
  description: string;
  tags: string;
  status: "draft" | "active" | "suspended" | "archived";
}

const emptyDatasetForm: DatasetFormData = {
  title: "",
  category: "",
  visibility: "private",
  publicPreviewEnabled: false,
  description: "",
  tags: "",
  status: "draft",
};

const readCachedDatasets = (ownerId: string): DatasetWithSamples[] => {
  try {
    const cached = JSON.parse(localStorage.getItem(DATASET_CACHE_KEY) ?? "{}") as Record<
      string,
      DatasetWithSamples[]
    >;
    return cached[ownerId] ?? [];
  } catch {
    return [];
  }
};

const cacheDatasets = (ownerId: string, datasets: DatasetWithSamples[]) => {
  try {
    const cached = JSON.parse(localStorage.getItem(DATASET_CACHE_KEY) ?? "{}") as Record<
      string,
      DatasetWithSamples[]
    >;
    localStorage.setItem(
      DATASET_CACHE_KEY,
      JSON.stringify({ ...cached, [ownerId]: datasets })
    );
  } catch {
    // La administración continúa funcionando si el almacenamiento del navegador está lleno.
  }
};

const toOwnerForm = (owner: Owner): OwnerFormData => ({
  name: owner.name,
  type: owner.type === "company" || owner.type === "org" ? "company" : "individual",
  description: owner.description ?? "",
  website: owner.website ?? "",
  email: owner.email ?? "",
});

const toDatasetForm = (dataset: DatasetWithSamples): DatasetFormData => ({
  title: dataset.title,
  category: dataset.category ?? "",
  visibility: dataset.visibility ?? "private",
  publicPreviewEnabled: dataset.publicPreviewEnabled ?? false,
  description: dataset.description,
  tags: dataset.tags.join(", "),
  status: dataset.status ?? "draft",
});

const getAllowedDatasetStatuses = (
  status: DatasetFormData["status"]
): DatasetFormData["status"][] => {
  const allowed: Record<DatasetFormData["status"], DatasetFormData["status"][]> = {
    draft: ["draft", "active", "archived"],
    active: ["active", "suspended", "archived"],
    suspended: ["suspended", "active", "archived"],
    archived: ["archived"],
  };

  return allowed[status];
};

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const OwnerDetailPage: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, logout } = useAuth();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [members, setMembers] = useState<OwnerMembership[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<DatasetWithSamples[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ownerForm, setOwnerForm] = useState<OwnerFormData | null>(null);
  const [editingOwner, setEditingOwner] = useState(false);
  const [savingOwner, setSavingOwner] = useState(false);
  const [invitationForm, setInvitationForm] = useState({
    invited_user_id: "",
    role: "owner_editor" as OwnerMembershipRole,
    expires_at: "",
    confirmation: false,
  });
  const [inviting, setInviting] = useState(false);
  const [invitationSuccess, setInvitationSuccess] = useState<string | null>(null);
  const [memberSaving, setMemberSaving] = useState<string | null>(null);
  const [datasetEditorOpen, setDatasetEditorOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState<DatasetWithSamples | null>(null);
  const [datasetSaving, setDatasetSaving] = useState(false);
  const [datasetError, setDatasetError] = useState<string | null>(null);
  const [datasetSuccess, setDatasetSuccess] = useState<string | null>(null);

  const membership = useMemo(
    () => members.find((candidate) => candidate.user_id === currentUserId) ?? null,
    [currentUserId, members]
  );
  const capabilities = useMemo(() => getOwnerCapabilities(membership), [membership]);

  const loadOwner = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    setError(null);
    try {
      const loadedOwner = await fetchOwner(ownerId);
      setOwner(loadedOwner);
      setOwnerForm(toOwnerForm(loadedOwner));
      if (isAuthenticated) {
        const currentUser = await getCurrentUser(accessToken);
        setCurrentUserId(currentUser.id ?? null);
      } else {
        setCurrentUserId(null);
      }

      if (isAuthenticated) {
        try {
          setMembers(await fetchOwnerMembers(ownerId));
        } catch {
          setMembers([]);
        }
      } else {
        setMembers([]);
      }

      const publicDatasets = await fetchDatasets().catch(() => []);
      const cachedDatasets = readCachedDatasets(ownerId);
      const refreshedCachedDatasets = await Promise.all(
        cachedDatasets.map((dataset) =>
          fetchDatasetById(dataset._id).catch(() => dataset)
        )
      );
      const ownerDatasets = [...refreshedCachedDatasets, ...publicDatasets].filter(
        (dataset) => dataset.owner_id === ownerId
      );
      const uniqueDatasets = Array.from(
        new Map(ownerDatasets.map((dataset) => [dataset._id, dataset])).values()
      );
      setDatasets(uniqueDatasets);
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cargar este proveedor."
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, isAuthenticated, logout, navigate, ownerId]);

  useEffect(() => {
    void loadOwner();
  }, [loadOwner]);

  const handleOwnerFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setOwnerForm((current) => (current ? { ...current, [name]: value } : current));
  };

  const handleOwnerSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ownerId || !ownerForm) return;
    setSavingOwner(true);
    setError(null);
    try {
      const updated = await updateOwner(ownerId, {
        name: ownerForm.name.trim(),
        type: ownerForm.type,
        description: ownerForm.description.trim() || undefined,
        website: ownerForm.website.trim() || undefined,
        email: ownerForm.email.trim() || undefined,
      });
      setOwner(updated);
      setOwnerForm(toOwnerForm(updated));
      setEditingOwner(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "No se pudo actualizar el proveedor."
      );
    } finally {
      setSavingOwner(false);
    }
  };

  const handleArchiveOwner = async () => {
    if (!ownerId || !window.confirm("¿Quieres archivar este proveedor? Esta acción quitará su disponibilidad pública.")) {
      return;
    }
    try {
      await archiveOwner(ownerId, "owner_requested");
      navigate("/owners");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "No se pudo archivar el proveedor."
      );
    }
  };

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ownerId) return;
    setInviting(true);
    setError(null);
    setInvitationSuccess(null);
    const expiresAt = new Date(invitationForm.expires_at);
    if (Number.isNaN(expiresAt.getTime())) {
      setError("Selecciona una fecha de vencimiento válida.");
      setInviting(false);
      return;
    }
    const payload: OwnerInvitationCreate = {
      invited_user_id: invitationForm.invited_user_id.trim(),
      role: invitationForm.role,
      expires_at: expiresAt.toISOString(),
      confirmation: invitationForm.role === "owner_admin" && invitationForm.confirmation,
    };

    try {
      await createOwnerInvitation(ownerId, payload);
      setInvitationForm((current) => ({ ...current, invited_user_id: "", confirmation: false }));
      setInvitationSuccess("Invitación creada. El destinatario la verá en su bandeja dentro de taloop.");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "No se pudo crear la invitación."
      );
    } finally {
      setInviting(false);
    }
  };

  const handleMemberUpdate = async (
    member: OwnerMembership,
    field: "role" | "status",
    value: OwnerMembershipRole | OwnerMembershipStatus
  ) => {
    if (!ownerId) return;
    setMemberSaving(member.user_id);
    try {
      const updated = await updateOwnerMember(ownerId, member.user_id, { [field]: value });
      setMembers((current) => current.map((item) => item.user_id === member.user_id ? updated : item));
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "No se pudo actualizar la membresía."
      );
    } finally {
      setMemberSaving(null);
    }
  };

  const openNewDataset = () => {
    setEditingDataset(null);
    setDatasetEditorOpen(true);
    setDatasetError(null);
    setDatasetSuccess(null);
  };

  const saveDatasetToCache = (dataset: DatasetWithSamples) => {
    if (!ownerId) return;
    const next = [...datasets.filter((item) => item._id !== dataset._id), dataset];
    setDatasets(next);
    cacheDatasets(ownerId, next);
  };

  const handleDatasetSave = async (form: DatasetFormData) => {
    if (!ownerId) return;
    setDatasetSaving(true);
    setDatasetError(null);
    setDatasetSuccess(null);
    const tags = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    try {
      if (editingDataset) {
        const data: DatasetUpdateData = {
          title: form.title.trim(),
          category: form.category.trim(),
          visibility: form.visibility,
          publicPreviewEnabled: form.publicPreviewEnabled,
          description: form.description.trim() || undefined,
          tags,
          ...(capabilities.canPublishDataset ? { status: form.status } : {}),
        };
        const updated = await updateDataset(editingDataset._id, data);
        saveDatasetToCache(updated);
        setDatasetSuccess("Borrador actualizado correctamente.");
      } else {
        const data: DatasetCreateData = {
          title: form.title.trim(),
          category: form.category.trim(),
          owner_id: ownerId,
          visibility: form.visibility,
          publicPreviewEnabled: form.publicPreviewEnabled,
          description: form.description.trim() || undefined,
          tags,
          fields: [],
        };
        const created = await createDataset(data);
        saveDatasetToCache(created);
        setDatasetSuccess("Dataset creado como borrador.");
      }
      setDatasetEditorOpen(false);
      setEditingDataset(null);
    } catch (requestError) {
      setDatasetError(
        requestError instanceof Error ? requestError.message : "No se pudo guardar el dataset."
      );
    } finally {
      setDatasetSaving(false);
    }
  };

  const handleDatasetArchive = async (dataset: DatasetWithSamples) => {
    if (!window.confirm("¿Quieres archivar este dataset?")) return;
    try {
      await archiveDataset(dataset._id);
      const archived = { ...dataset, status: "archived" as const };
      saveDatasetToCache(archived);
      setDatasetSuccess("Dataset archivado.");
    } catch (requestError) {
      setDatasetError(
        requestError instanceof Error ? requestError.message : "No se pudo archivar el dataset."
      );
    }
  };

  if (loading) {
    return (
      <div className="workspace-page">
        <AppHeader />
        <div className="workspace-state"><Loading size="lg" text="Cargando proveedor..." /></div>
      </div>
    );
  }

  if (error && !owner) {
    return (
      <div className="workspace-page">
        <AppHeader />
        <main className="workspace-content workspace-content--narrow">
          <div className="workspace-message workspace-message--error" role="alert">{error}</div>
          <Button onClick={() => void loadOwner()}>Reintentar</Button>
        </main>
      </div>
    );
  }

  if (!owner || !ownerId) return null;

  if (!membership || membership.status !== "active") {
    return (
      <div className="workspace-page">
        <AppHeader />
        <main className="workspace-content workspace-content--narrow">
          <Link to={isAuthenticated ? "/owners" : "/"} className="workspace-back-link">
            {isAuthenticated ? "← Volver a mis perfiles de proveedor" : "← Volver al catálogo"}
          </Link>
          <section className="workspace-card" aria-labelledby="owner-blocked-title">
            <span className="workspace-eyebrow">Perfil de proveedor</span>
            <h1 id="owner-blocked-title">{owner.name}</h1>
            <div className="workspace-message workspace-message--error" role="alert">
              {isAuthenticated
                ? "No tienes acceso activo a este proveedor. Tus permisos se definen para cada proveedor, independientemente de tus intereses o del rol general de tu cuenta."
                : "Este es un proveedor público. Inicia sesión para comprobar si tienes acceso y entrar al panel de administración."}
            </div>
            <Link to={isAuthenticated ? "/owners" : "/login"} className="workspace-back-link">
              {isAuthenticated ? "Ir a mis perfiles de proveedor" : "Iniciar sesión"}
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <AppHeader />
      <main className="workspace-content">
        <Link to="/owners" className="workspace-back-link">← Volver a mis perfiles de proveedor</Link>
        {error && <div className="workspace-message workspace-message--error" role="alert">{error}</div>}
        <section className="owner-detail-hero workspace-card">
          <div>
            <span className="workspace-eyebrow">{ownerTypeLabel(owner.type)} · {roleLabel(membership.role)}</span>
            <h1>{owner.name}</h1>
            <p>{owner.description || "Este proveedor aún no tiene una descripción."}</p>
          </div>
          <div className="workspace-inline-actions">
            {capabilities.canEditOwner && <Button variant="outline" onClick={() => setEditingOwner((current) => !current)}>{editingOwner ? "Cancelar edición" : "Editar proveedor"}</Button>}
            {capabilities.canEditOwner && <Button variant="ghost" onClick={handleArchiveOwner}>Archivar proveedor</Button>}
          </div>
        </section>

        {editingOwner && ownerForm && (
          <section className="workspace-card workspace-card--spaced" aria-labelledby="edit-owner-title">
            <div className="workspace-card__header"><h2 id="edit-owner-title">Editar proveedor</h2></div>
            <form className="workspace-form" onSubmit={handleOwnerSave}>
              <div className="workspace-form__row">
                <div className="workspace-field"><label htmlFor="edit-owner-name">Nombre</label><input id="edit-owner-name" name="name" value={ownerForm.name} onChange={handleOwnerFormChange} required /></div>
                <div className="workspace-field"><label htmlFor="edit-owner-type">Tipo</label><select id="edit-owner-type" name="type" value={ownerForm.type} onChange={handleOwnerFormChange}><option value="company">Empresa</option><option value="individual">Persona</option></select></div>
              </div>
              <div className="workspace-field"><label htmlFor="edit-owner-description">Descripción</label><textarea id="edit-owner-description" name="description" value={ownerForm.description} onChange={handleOwnerFormChange} /></div>
              <div className="workspace-form__row">
                <div className="workspace-field"><label htmlFor="edit-owner-website">Sitio web</label><input id="edit-owner-website" name="website" type="url" value={ownerForm.website} onChange={handleOwnerFormChange} /></div>
                <div className="workspace-field"><label htmlFor="edit-owner-email">Correo</label><input id="edit-owner-email" name="email" type="email" value={ownerForm.email} onChange={handleOwnerFormChange} /></div>
              </div>
              <Button type="submit" loading={savingOwner}>Guardar cambios</Button>
            </form>
          </section>
        )}

        <div className="owner-detail-grid">
          {capabilities.canInvite && (
            <section className="workspace-card" aria-labelledby="invite-title">
              <div className="workspace-card__header"><h2 id="invite-title">Invitar colaboradores</h2><p>Las personas invitadas podrán aceptar el acceso desde su bandeja.</p></div>
              {invitationSuccess && <div className="workspace-message workspace-message--success" role="status">{invitationSuccess}</div>}
              <form className="workspace-form" onSubmit={handleInvite}>
                <div className="workspace-field"><label htmlFor="invited-user-id">Identificador del usuario registrado</label><input id="invited-user-id" value={invitationForm.invited_user_id} onChange={(event) => setInvitationForm((current) => ({ ...current, invited_user_id: event.target.value }))} required /><span className="workspace-field__hint">La persona debe tener una cuenta registrada en taloop.</span></div>
                <div className="workspace-form__row">
                  <div className="workspace-field"><label htmlFor="invitation-role">Rol ofrecido</label><select id="invitation-role" value={invitationForm.role} onChange={(event) => setInvitationForm((current) => ({ ...current, role: event.target.value as OwnerMembershipRole }))}><option value="owner_editor">Editor</option><option value="owner_viewer">Lector</option><option value="owner_admin">Administrador</option></select></div>
                  <div className="workspace-field"><label htmlFor="invitation-expires">Vence</label><input id="invitation-expires" type="datetime-local" value={invitationForm.expires_at} onChange={(event) => setInvitationForm((current) => ({ ...current, expires_at: event.target.value }))} required /></div>
                </div>
                {invitationForm.role === "owner_admin" && <label className="workspace-check"><input type="checkbox" checked={invitationForm.confirmation} onChange={(event) => setInvitationForm((current) => ({ ...current, confirmation: event.target.checked }))} required /><span>Confirmo que quiero ofrecer permisos de administrador.</span></label>}
                <Button type="submit" loading={inviting}>Crear invitación</Button>
              </form>
            </section>
          )}

          {capabilities.canManageMembers && (
            <section className="workspace-card" aria-labelledby="members-title">
              <div className="workspace-card__header"><h2 id="members-title">Personas con acceso</h2><p>Aquí puedes revisar y cambiar el acceso de las personas a este proveedor.</p></div>
              <div className="member-list">
                {members.map((member) => (
                  <div className="member-row" key={member.user_id}>
                    <span className="member-row__id">{member.user_id}</span>
                    <select aria-label={`Rol de ${member.user_id}`} value={member.role} disabled={memberSaving === member.user_id} onChange={(event) => void handleMemberUpdate(member, "role", event.target.value as OwnerMembershipRole)}><option value="owner_admin">Administrador</option><option value="owner_editor">Editor</option><option value="owner_viewer">Lector</option></select>
                    <select aria-label={`Estado de ${member.user_id}`} value={member.status} disabled={memberSaving === member.user_id} onChange={(event) => void handleMemberUpdate(member, "status", event.target.value as OwnerMembershipStatus)}><option value="active">Activa</option><option value="suspended">Suspendida</option><option value="revoked">Revocada</option></select>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {capabilities.canViewInternal && (
          <section className="workspace-card workspace-card--spaced owner-datasets-section" aria-labelledby="datasets-title">
            <div className="workspace-section-heading">
              <div><span className="workspace-eyebrow">Contenido del proveedor</span><h2 id="datasets-title">Datasets</h2><p>Los nuevos datasets empiezan como borradores. Solo un Administrador puede publicarlos.</p></div>
              {capabilities.canCreateDataset && <Button onClick={openNewDataset}>Crear dataset</Button>}
            </div>
            {datasetSuccess && <div className="workspace-message workspace-message--success" role="status">{datasetSuccess}</div>}
            {datasetError && <div className="workspace-message workspace-message--error" role="alert">{datasetError}</div>}
            {datasetEditorOpen && <DatasetEditor initialDataset={editingDataset} canPublish={capabilities.canPublishDataset} saving={datasetSaving} onCancel={() => { setDatasetEditorOpen(false); setEditingDataset(null); }} onSave={handleDatasetSave} />}
            {datasets.length === 0 ? <div className="workspace-empty">Aún no hay datasets visibles para este proveedor.</div> : <div className="dataset-admin-list">{datasets.map((dataset) => { const canEdit = capabilities.canEditDraft && dataset.status !== "archived" && (dataset.status === "draft" || capabilities.canPublishDataset); return <article className="dataset-admin-row" key={dataset._id}><div><span className={`dataset-status dataset-status--${dataset.status}`}>{dataset.status}</span><h3>{dataset.title}</h3><p>{dataset.description || "Sin descripción"}</p><span className="workspace-field__hint">{dataset.visibility} · actualización {dataset.timestamps?.updatedAt ? formatDate(dataset.timestamps.updatedAt) : "sin fecha"}</span></div><div className="workspace-inline-actions">{canEdit && <Button size="sm" variant="outline" onClick={() => { setEditingDataset(dataset); setDatasetEditorOpen(true); setDatasetError(null); }}>Editar</Button>}{capabilities.canPublishDataset && dataset.status !== "archived" && <Button size="sm" variant="ghost" onClick={() => void handleDatasetArchive(dataset)}>Archivar</Button>}</div></article>; })}</div>}
          </section>
        )}
      </main>
    </div>
  );
};

interface DatasetEditorProps {
  initialDataset: DatasetWithSamples | null;
  canPublish: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: (form: DatasetFormData) => Promise<void>;
}

const DatasetEditor: React.FC<DatasetEditorProps> = ({ initialDataset, canPublish, saving, onCancel, onSave }) => {
  const [form, setForm] = useState<DatasetFormData>(initialDataset ? toDatasetForm(initialDataset) : emptyDatasetForm);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value }));
  };

  return (
    <form className="dataset-editor" onSubmit={(event) => { event.preventDefault(); void onSave(form); }}>
      <div className="workspace-form__row">
        <div className="workspace-field"><label htmlFor="dataset-title">Título</label><input id="dataset-title" name="title" value={form.title} onChange={handleChange} required /></div>
        <div className="workspace-field"><label htmlFor="dataset-category">Categoría</label><input id="dataset-category" name="category" value={form.category} onChange={handleChange} required /></div>
      </div>
      <div className="workspace-field"><label htmlFor="dataset-description">Descripción</label><textarea id="dataset-description" name="description" value={form.description} onChange={handleChange} /></div>
      <div className="workspace-form__row">
        <div className="workspace-field"><label htmlFor="dataset-visibility">Visibilidad</label><select id="dataset-visibility" name="visibility" value={form.visibility} onChange={handleChange}><option value="private">Privado</option><option value="unlisted">No listado</option><option value="public">Público</option></select></div>
        <div className="workspace-field"><label htmlFor="dataset-tags">Tags</label><input id="dataset-tags" name="tags" value={form.tags} onChange={handleChange} placeholder="movilidad, ciudad" /></div>
      </div>
      <label className="workspace-check"><input type="checkbox" name="publicPreviewEnabled" checked={form.publicPreviewEnabled} onChange={handleChange} /><span>Permitir vista previa pública limitada (solo datasets activos públicos o no listados).</span></label>
      {initialDataset && canPublish && <div className="workspace-field"><label htmlFor="dataset-status">Estado</label><select id="dataset-status" name="status" value={form.status} onChange={handleChange}>{getAllowedDatasetStatuses(form.status).map((status) => <option value={status} key={status}>{status === "draft" ? "Borrador" : status === "active" ? "Activo / publicado" : status === "suspended" ? "Suspendido" : "Archivado"}</option>)}</select><span className="workspace-field__hint">Publicar, suspender o archivar requiere el rol de Administrador.</span></div>}
      <div className="workspace-inline-actions"><Button type="submit" loading={saving}>{initialDataset ? "Guardar cambios" : "Crear borrador"}</Button><Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button></div>
    </form>
  );
};

export default OwnerDetailPage;
