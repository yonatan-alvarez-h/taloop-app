export type OwnerType = "company" | "individual";
export type OwnerStatus = "active" | "suspended" | "archived";
export type OwnerMembershipRole =
  | "owner_admin"
  | "owner_editor"
  | "owner_viewer";
export type OwnerMembershipStatus = "active" | "suspended" | "revoked";
export type OwnerInvitationStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired"
  | "revoked";

export interface Owner {
  _id: string;
  name: string;
  type: OwnerType | "person" | "org";
  logoUrl?: string | null;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  status?: OwnerStatus;
  created_at?: string;
  updated_at?: string;
}

export interface OwnerMembership {
  id?: string | null;
  user_id: string;
  owner_id: string;
  role: OwnerMembershipRole;
  status: OwnerMembershipStatus;
  created_at: string;
  updated_at: string;
  user?: OwnerMemberSummary | null;
}

export interface OwnerMemberSummary {
  id: string;
  email: string;
  full_name?: string | null;
}

export interface OwnerInvitationOwnerSummary {
  id: string;
  name: string;
  type: string;
}

export interface OwnerInvitationInviterSummary {
  id: string;
  email: string;
  full_name?: string | null;
}

export interface OwnerInvitation {
  id: string;
  owner_id: string;
  invited_user_id: string;
  role: OwnerMembershipRole;
  status: OwnerInvitationStatus;
  expires_at: string;
  invited_by_user_id: string;
  accepted_at?: string | null;
  declined_at?: string | null;
  created_at: string;
  owner?: OwnerInvitationOwnerSummary | null;
  invited_by?: OwnerInvitationInviterSummary | null;
}

export interface OwnerInvitationCreate {
  invited_user_id: string;
  role: OwnerMembershipRole;
  expires_at: string;
  confirmation: boolean;
}

export interface OwnerUpdateData {
  name?: string;
  type?: OwnerType;
  logoUrl?: string;
  description?: string;
  website?: string;
  email?: string;
}

export interface OwnerCapabilities {
  canEditOwner: boolean;
  canInvite: boolean;
  canManageMembers: boolean;
  canCreateDataset: boolean;
  canEditDraft: boolean;
  canPublishDataset: boolean;
  canViewInternal: boolean;
}

export const getOwnerCapabilities = (
  membership: OwnerMembership | null
): OwnerCapabilities => {
  const active = membership?.status === "active";
  const admin = active && membership.role === "owner_admin";
  const editor = active && membership.role === "owner_editor";
  const viewer = active && membership.role === "owner_viewer";

  return {
    canEditOwner: Boolean(admin),
    canInvite: Boolean(admin),
    canManageMembers: Boolean(admin),
    canCreateDataset: Boolean(admin || editor),
    canEditDraft: Boolean(admin || editor),
    canPublishDataset: Boolean(admin),
    canViewInternal: Boolean(admin || editor || viewer),
  };
};

export const ownerTypeLabel = (type: Owner["type"]): string => {
  return type === "company" || type === "org" ? "Empresa" : "Persona";
};

export const roleLabel = (role: OwnerMembershipRole): string => {
  const labels: Record<OwnerMembershipRole, string> = {
    owner_admin: "Administrador",
    owner_editor: "Editor",
    owner_viewer: "Lector",
  };

  return labels[role];
};
