import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Button from "../../components/UI/Button";
import Loading from "../../components/UI/Loading";
import { useInvitations } from "../../context/useInvitations";
import { acceptOwnerInvitation, declineOwnerInvitation } from "../../services/ownersService";
import { ApiError } from "../../services/api";
import { roleLabel } from "../../types/owner";
import "../WorkspacePage.css";

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

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
            <p>Revisa las invitaciones dirigidas a tu cuenta.</p>
          </div>
          <Button variant="outline" onClick={() => void refreshInvitations()}>Actualizar</Button>
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
                    <span className="workspace-eyebrow">Invitación pendiente</span>
                    <h2>{invitation.owner?.name ?? "Owner sin nombre"}</h2>
                  </div>
                  <span className="invitation-role">{roleLabel(invitation.role)}</span>
                </div>
                <dl className="invitation-details">
                  <div><dt>Enviada</dt><dd>{formatDate(invitation.created_at)}</dd></div>
                  <div><dt>Vence</dt><dd>{formatDate(invitation.expires_at)}</dd></div>
                  <div><dt>Emisor</dt><dd className="invitation-details__id">{invitation.invited_by_user_id}</dd></div>
                </dl>
                <div className="workspace-inline-actions">
                  <Button disabled={decisionId !== null} loading={decisionId === invitation.id} onClick={() => void handleDecision(invitation.id, true)}>Aceptar</Button>
                  <Button variant="outline" disabled={decisionId !== null} onClick={() => void handleDecision(invitation.id, false)}>Rechazar</Button>
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
