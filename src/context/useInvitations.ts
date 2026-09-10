import { useContext } from "react";
import { InvitationsContext } from "./invitationsContext";

export const useInvitations = () => {
  const context = useContext(InvitationsContext);
  if (!context) {
    throw new Error("useInvitations debe usarse dentro de un InvitationsProvider");
  }
  return context;
};
