import { ApiError, requestJson, requestNoContent } from "./api";
import type {
  DatasetPublicResponse,
  FavoriteList,
  FavoriteListMembership,
  OffsetPage,
} from "../types/favorite";

const DATASET_ID_PATTERN = /^[a-f\d]{24}$/i;

export async function fetchFavoriteListsPage(
  limit = 20,
  offset = 0
): Promise<OffsetPage<FavoriteList>> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  return requestJson<OffsetPage<FavoriteList>>(
    `/users/me/favorite-lists/page?${params.toString()}`
  );
}

export async function fetchAllFavoriteLists(): Promise<FavoriteList[]> {
  const lists: FavoriteList[] = [];
  const visitedOffsets = new Set<number>();
  let offset = 0;

  while (true) {
    if (visitedOffsets.has(offset)) {
      throw new Error("La paginación de listas de favoritos no es válida.");
    }
    visitedOffsets.add(offset);

    const page = await fetchFavoriteListsPage(20, offset);
    lists.push(...page.data);

    if (page.next_offset === null) return lists;
    offset = page.next_offset;
  }
}

export async function createFavoriteList(name: string): Promise<FavoriteList> {
  return requestJson<FavoriteList>("/users/me/favorite-lists", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: name.trim() }),
  });
}

export async function renameFavoriteList(
  listId: string,
  name: string
): Promise<FavoriteList> {
  return requestJson<FavoriteList>(
    `/users/me/favorite-lists/${encodeURIComponent(listId)}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    }
  );
}

export async function deleteFavoriteList(listId: string): Promise<void> {
  await requestNoContent(
    `/users/me/favorite-lists/${encodeURIComponent(listId)}`,
    { method: "DELETE" }
  );
}

export async function addDatasetToFavoriteList(
  listId: string,
  datasetId: string
): Promise<void> {
  await requestNoContent(
    `/users/me/favorite-lists/${encodeURIComponent(
      listId
    )}/datasets/${encodeURIComponent(datasetId)}`,
    { method: "PUT" }
  );
}

export async function removeDatasetFromFavoriteList(
  listId: string,
  datasetId: string
): Promise<void> {
  await requestNoContent(
    `/users/me/favorite-lists/${encodeURIComponent(
      listId
    )}/datasets/${encodeURIComponent(datasetId)}`,
    { method: "DELETE" }
  );
}

export async function fetchFavoriteListDatasetsPage(
  listId: string,
  limit = 20,
  offset = 0
): Promise<OffsetPage<DatasetPublicResponse>> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  return requestJson<OffsetPage<DatasetPublicResponse>>(
    `/users/me/favorite-lists/${encodeURIComponent(
      listId
    )}/datasets/page?${params.toString()}`
  );
}

export async function fetchAllFavoriteListDatasets(
  listId: string
): Promise<DatasetPublicResponse[]> {
  const datasets: DatasetPublicResponse[] = [];
  const visitedOffsets = new Set<number>();
  let offset = 0;

  while (true) {
    if (visitedOffsets.has(offset)) {
      throw new Error("La paginación de favoritos no es válida.");
    }
    visitedOffsets.add(offset);

    const page = await fetchFavoriteListDatasetsPage(listId, 20, offset);
    datasets.push(...page.data);

    if (page.next_offset === null) return datasets;
    offset = page.next_offset;
  }
}

export async function lookupFavoriteListMemberships(
  datasetIds: string[]
): Promise<FavoriteListMembership[]> {
  const ids = [...new Set(datasetIds)];

  if (
    ids.length < 1 ||
    ids.length > 100 ||
    ids.some((datasetId) => !DATASET_ID_PATTERN.test(datasetId))
  ) {
    throw new ApiError("No se pudieron resolver los favoritos.", 422);
  }

  return requestJson<FavoriteListMembership[]>(
    "/users/me/favorite-list-memberships/lookup",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dataset_ids: ids }),
    }
  );
}
