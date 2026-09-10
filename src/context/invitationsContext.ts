import { createContext } from "react";
import type { OwnerInvitation } from "../types/owner";

export interface InvitationsContextValue {
  invitations: OwnerInvitation[];
  loading: boolean;
  error: string | null;
  refreshInvitations: () => Promise<void>;
  removeInvitation: (invitationId: string) => void;
}

export const InvitationsContext = createContext<
  InvitationsContextValue | undefined
>(undefined);
