import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Button from "../../components/UI/Button";
import Loading from "../../components/UI/Loading";
import { useInvitations } from "../../context/useInvitations";
import { acceptOwnerInvitation, declineOwnerInvitation } from "../../services/ownersService";
import { ApiError } from "../../services/api";
import { roleLabel } from "../../types/owner";
import type { OwnerInvitation, OwnerMembershipRole } from "../../types/owner";
import "../WorkspacePage.css";

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const roleDescription: Record<OwnerMembershipRole, string> = {
  owner_admin: "Administrar el proveedor, sus miembros y sus publicaciones.",
  owner_editor: "Crear y editar datasets en borrador.",
  owner_viewer: "Consultar los datasets disponibles.",
};

const getInviterName = (invitation: OwnerInvitation): string => {
  const fullName = invitation.invited_by?.full_name?.trim();
  return fullName || invitation.invited_by?.email || "Una cuenta de taloop";
};

const getExpiryStatus = (value: string): { label: string; isSoon: boolean } => {
  const remainingMs = new Date(value).getTime() - Date.now();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  if (remainingMs <= 0) {
    return { label: "Vencida", isSoon: true };
  }
  if (remainingMs < hour) {
    return {
      label: `Vence en ${Math.max(1, Math.ceil(remainingMs / 60000))} min`,
      isSoon: true,
    };
  }
  if (remainingMs < day) {
    return { label: `Vence en ${Math.ceil(remainingMs / hour)} h`, isSoon: true };
  }
  if (remainingMs < 7 * day) {
    return { label: `Vence en ${Math.ceil(remainingMs / day)} días`, isSoon: false };
  }
  return { label: `Vence el ${formatDate(value)}`, isSoon: false };
};

const InvitationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    invitations,
    loading,
    error,
    refreshInvitations,
    removeInvitation,
  } = useInvitations();
  const [decisionId, setDecisionId] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [declineConfirmationId, setDeclineConfirmationId] = useState<string | null>(null);

  const handleDecision = async (invitationId: string, accept: boolean) => {
    setDecisionId(invitationId);
    setDecisionError(null);
    try {
      if (accept) {
        await acceptOwnerInvitation(invitationId);
      } else {
        await declineOwnerInvitation(invitationId);
      }
      removeInvitation(invitationId);
      await refreshInvitations();
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      if (requestError instanceof ApiError && requestError.status === 409) {
        setDecisionError(
          "Esta invitación expiró o ya fue resuelta en otra pestaña. Actualizamos la bandeja."
        );
        await refreshInvitations();
      } else {
        setDecisionError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo resolver la invitación. Intenta de nuevo."
        );
      }
    } finally {
      setDecisionId(null);
    }
  };

  return (
    <div className="workspace-page">
      <AppHeader />
      <main className="workspace-content workspace-content--narrow">
        <div className="workspace-heading">
          <div>
            <span className="workspace-eyebrow">Acceso contextual</span>
            <h1>Invitaciones</h1>
            <p>Revisa y decide qué accesos aceptar en tu cuenta.</p>
          </div>
          <Button variant="outline" onClick={() => void refreshInvitations()}>Actualizar invitaciones</Button>
        </div>

        {(error || decisionError) && (
          <div className="workspace-message workspace-message--error" role="alert">
            {decisionError ?? error}
            {error && !decisionError && <button type="button" className="workspace-retry" onClick={() => void refreshInvitations()}>Reintentar</button>}
          </div>
        )}

        {loading ? (
          <div className="workspace-state"><Loading size="lg" text="Cargando invitaciones..." /></div>
        ) : invitations.length === 0 ? (
          <div className="workspace-empty">
            <h2>No tienes invitaciones pendientes</h2>
            <p>Las invitaciones nuevas aparecerán aquí dentro de la aplicación.</p>
          </div>
        ) : (
          <div className="invitation-list">
            {invitations.map((invitation) => (
              <article className="invitation-card" key={invitation.id}>
                <div className="invitation-card__header">
                  <div>
                    <span className="invitation-status">
                      <span className="invitation-status__dot" aria-hidden="true" />
                      Invitación pendiente
                    </span>
                    <h2>{invitation.owner?.name ?? "Proveedor sin nombre"}</h2>
                  </div>
                  <span className="invitation-role">{roleLabel(invitation.role)}</span>
                </div>
                <div className="invitation-card__summary">
                  <p>
                    <strong>{getInviterName(invitation)}</strong> te invita a colaborar en este proveedor.
                  </p>
                  <p className="invitation-card__permission">{roleDescription[invitation.role]}</p>
                </div>
                <dl className="invitation-details">
                  <div>
                    <dt>Invitada por</dt>
                    <dd className="invitation-details__person">
                      <strong>{getInviterName(invitation)}</strong>
                      {invitation.invited_by?.full_name && <span>{invitation.invited_by.email}</span>}
                    </dd>
                  </div>
                  <div><dt>Recibida</dt><dd>{formatDate(invitation.created_at)}</dd></div>
                  <div className={getExpiryStatus(invitation.expires_at).isSoon ? "invitation-details__expiry invitation-details__expiry--soon" : "invitation-details__expiry"}>
                    <dt>Vencimiento</dt>
                    <dd>
                      <strong>{getExpiryStatus(invitation.expires_at).label}</strong>
                      <span>{formatDate(invitation.expires_at)}</span>
                    </dd>
                  </div>
                </dl>
                <details className="invitation-technical">
                  <summary>Ver detalles técnicos</summary>
                  <dl>
                    <div><dt>ID de invitación</dt><dd>{invitation.id}</dd></div>
                    <div><dt>ID de quien invita</dt><dd>{invitation.invited_by_user_id}</dd></div>
                  </dl>
                </details>
                <div className="invitation-card__footer">
                  {declineConfirmationId === invitation.id ? (
                    <div className="invitation-confirmation" role="alert">
                      <p>¿Seguro que quieres rechazar esta invitación?</p>
                      <div className="workspace-inline-actions">
                        <Button variant="ghost" disabled={decisionId !== null} onClick={() => setDeclineConfirmationId(null)}>Cancelar</Button>
                        <Button variant="outline" disabled={decisionId !== null} loading={decisionId === invitation.id} onClick={() => void handleDecision(invitation.id, false)}>Sí, rechazar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="workspace-inline-actions">
                      <Button disabled={decisionId !== null} loading={decisionId === invitation.id} onClick={() => void handleDecision(invitation.id, true)}>Aceptar invitación</Button>
                      <Button variant="ghost" disabled={decisionId !== null} onClick={() => setDeclineConfirmationId(invitation.id)}>Rechazar</Button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InvitationsPage;
