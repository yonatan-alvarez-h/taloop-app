import type {
  Owner,
  OwnerInvitation,
  OwnerInvitationCreate,
  OwnerMemberSummary,
  OwnerMembership,
  OwnerUpdateData,
} from "../types/owner";
import { requestJson, requestNoContent } from "./api";

interface OwnerListResponse {
  data: Owner[];
  total: number;
  limit: number;
  offset: number;
}

const normalizeOwner = (owner: Owner & { id?: string }): Owner => ({
  ...owner,
  _id: owner._id ?? owner.id ?? "",
});

export async function fetchPublicOwners(
  limit = 100,
  offset = 0
): Promise<Owner[]> {
  const response = await requestJson<OwnerListResponse | Owner[]>(
    `/owners?limit=${limit}&offset=${offset}`,
    {},
    { authenticated: false }
  );

  return (Array.isArray(response) ? response : response.data).map(normalizeOwner);
}

export async function fetchOwner(ownerId: string): Promise<Owner> {
  const owner = await requestJson<Owner & { id?: string }>(
    `/owners/${encodeURIComponent(ownerId)}`,
    {},
    { authenticated: false }
  );
  return normalizeOwner(owner);
}

export async function createOwner(data: OwnerUpdateData): Promise<Owner> {
  const owner = await requestJson<Owner & { id?: string }>("/owners", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return normalizeOwner(owner);
}

export async function updateOwner(
  ownerId: string,
  data: OwnerUpdateData
): Promise<Owner> {
  const owner = await requestJson<Owner & { id?: string }>(
    `/owners/${encodeURIComponent(ownerId)}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return normalizeOwner(owner);
}

export async function archiveOwner(ownerId: string, reason: string): Promise<void> {
  await requestNoContent(
    `/owners/${encodeURIComponent(ownerId)}?confirmation=true&reason=${encodeURIComponent(
      reason
    )}`,
    { method: "DELETE" }
  );
}

export async function fetchOwnerMembers(
  ownerId: string
): Promise<OwnerMembership[]> {
  return requestJson<OwnerMembership[]>(
    `/owners/${encodeURIComponent(ownerId)}/members`
  );
}

export async function searchOwnerMemberCandidates(
  ownerId: string,
  query: string
): Promise<OwnerMemberSummary[]> {
  return requestJson<OwnerMemberSummary[]>(
    `/owners/${encodeURIComponent(ownerId)}/member-candidates?query=${encodeURIComponent(query)}`
  );
}

export async function updateOwnerMember(
  ownerId: string,
  userId: string,
  data: Partial<Pick<OwnerMembership, "role" | "status">>
): Promise<OwnerMembership> {
  return requestJson<OwnerMembership>(
    `/owners/${encodeURIComponent(ownerId)}/members/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    }
  );
}

export async function createOwnerInvitation(
  ownerId: string,
  data: OwnerInvitationCreate
): Promise<OwnerInvitation> {
  return requestJson<OwnerInvitation>(
    `/owners/${encodeURIComponent(ownerId)}/invitations`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    }
  );
}

export async function fetchMyOwnerInvitations(): Promise<OwnerInvitation[]> {
  return requestJson<OwnerInvitation[]>("/users/me/owner-invitations");
}

export async function acceptOwnerInvitation(
  invitationId: string
): Promise<OwnerMembership> {
  return requestJson<OwnerMembership>(
    `/users/me/owner-invitations/${encodeURIComponent(invitationId)}/accept`,
    { method: "POST" }
  );
}

export async function declineOwnerInvitation(
  invitationId: string
): Promise<OwnerInvitation> {
  return requestJson<OwnerInvitation>(
    `/users/me/owner-invitations/${encodeURIComponent(invitationId)}/decline`,
    { method: "POST" }
  );
}

export async function fetchMyOwners(): Promise<
  Array<{ owner: Owner; membership: OwnerMembership }>
> {
  const currentUser = await requestJson<{ id: string }>("/users/me");
  const owners = await fetchPublicOwners();
  const contexts = await Promise.all(
    owners.map(async (owner) => {
      try {
        const members = await fetchOwnerMembers(owner._id);
        const membership = members.find(
          (candidate) =>
            candidate.user_id === currentUser.id && candidate.status === "active"
        );
        return membership ? { owner, membership } : null;
      } catch {
        // 403 es la respuesta esperada para owners donde no hay acceso interno.
        return null;
      }
    })
  );

  return contexts.filter(
    (context): context is { owner: Owner; membership: OwnerMembership } =>
      context !== null
  );
}
