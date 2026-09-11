import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../services/api";
import {
  addDatasetToFavoriteList,
  createFavoriteList,
  deleteFavoriteList,
  fetchAllFavoriteListDatasets,
  fetchAllFavoriteLists,
  lookupFavoriteListMemberships,
  removeDatasetFromFavoriteList,
  renameFavoriteList,
} from "../services/favoriteListsService";
import type { DatasetPublicResponse, FavoriteList } from "../types/favorite";
import { useAuth } from "./useAuth";
import {
  FavoritesContext,
  type FavoriteMutationFailure,
  type FavoriteMutationResult,
} from "./favoritesContext";

const uniqueIds = (ids: string[]) => [...new Set(ids)];

const sortListsByUpdatedAt = (lists: FavoriteList[]) =>
  [...lists].sort(
    (first, second) =>
      new Date(second.updated_at).getTime() -
      new Date(first.updated_at).getTime()
  );

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const FavoritesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { isAuthenticated, logout } = useAuth();
  const [lists, setLists] = useState<FavoriteList[]>([]);
  const [memberships, setMemberships] = useState<Record<string, string[]>>({});
  const [listsLoading, setListsLoading] = useState(false);
  const [listsError, setListsError] = useState<string | null>(null);

  const refreshLists = useCallback(async () => {
    if (!isAuthenticated) {
      setLists([]);
      setMemberships({});
      setListsError(null);
      return;
    }

    setListsLoading(true);
    setListsError(null);
    try {
      const loadedLists = await fetchAllFavoriteLists();
      setLists(sortListsByUpdatedAt(loadedLists));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        return;
      }
      setListsError(
        getErrorMessage(error, "No se pudieron cargar tus listas de favoritos")
      );
    } finally {
      setListsLoading(false);
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    void refreshLists();
  }, [refreshLists]);

  const ensureMemberships = useCallback(
    async (datasetIds: string[]) => {
      const ids = uniqueIds(datasetIds);
      if (!isAuthenticated || ids.length === 0) return {};

      const missingIds = ids.filter((datasetId) => !(datasetId in memberships));
      let loadedMemberships: Record<string, string[]> = {};
      if (missingIds.length > 0) {
        try {
          const response = await lookupFavoriteListMemberships(missingIds);
          loadedMemberships = Object.fromEntries(
            response.map((membership) => [
              membership.dataset_id,
              uniqueIds(membership.list_ids),
            ])
          );
          setMemberships((current) => {
            const next = { ...current };
            response.forEach((membership) => {
              next[membership.dataset_id] = uniqueIds(membership.list_ids);
            });
            return next;
          });
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            logout();
          }
          throw error;
        }
      }

      const resolvedMemberships: Record<string, string[]> = {};
      ids.forEach((datasetId) => {
        resolvedMemberships[datasetId] =
          loadedMemberships[datasetId] ?? memberships[datasetId] ?? [];
      });

      return resolvedMemberships;
    },
    [isAuthenticated, logout, memberships]
  );

  const createList = useCallback(async (name: string) => {
    const createdList = await createFavoriteList(name);
    setLists((current) => sortListsByUpdatedAt([createdList, ...current]));
    return createdList;
  }, []);

  const renameList = useCallback(async (listId: string, name: string) => {
    const updatedList = await renameFavoriteList(listId, name);
    setLists((current) =>
      sortListsByUpdatedAt(
        current.map((list) => (list.id === listId ? updatedList : list))
      )
    );
    return updatedList;
  }, []);

  const deleteList = useCallback(async (listId: string) => {
    await deleteFavoriteList(listId);
    setLists((current) => current.filter((list) => list.id !== listId));
    setMemberships((current) => {
      const next: Record<string, string[]> = {};
      Object.entries(current).forEach(([datasetId, listIds]) => {
        next[datasetId] = listIds.filter((id) => id !== listId);
      });
      return next;
    });
  }, []);

  const updateDatasetLists = useCallback(
    async (datasetId: string, listIds: string[]): Promise<FavoriteMutationResult> => {
      const initialListIds = uniqueIds(memberships[datasetId] ?? []);
      const targetListIds = uniqueIds(listIds);
      const additions = targetListIds.filter((id) => !initialListIds.includes(id));
      const removals = initialListIds.filter((id) => !targetListIds.includes(id));
      const actions: Array<{
        action: "add" | "remove";
        listId: string;
        request: () => Promise<void>;
      }> = [
        ...additions.map((listId) => ({
          action: "add" as const,
          listId,
          request: () => addDatasetToFavoriteList(listId, datasetId),
        })),
        ...removals.map((listId) => ({
          action: "remove" as const,
          listId,
          request: () => removeDatasetFromFavoriteList(listId, datasetId),
        })),
      ];

      if (actions.length === 0) return { failures: [], succeeded: 0 };

      setMemberships((current) => ({
        ...current,
        [datasetId]: targetListIds,
      }));

      const settled = await Promise.allSettled(
        actions.map(async (action) => {
          await action.request();
          setMemberships((current) => {
            const currentIds = new Set(current[datasetId] ?? []);
            if (action.action === "add") currentIds.add(action.listId);
            else currentIds.delete(action.listId);
            return { ...current, [datasetId]: [...currentIds] };
          });
          return action;
        })
      );

      const failures: FavoriteMutationFailure[] = [];
      const successfulActions = new Set<string>();
      settled.forEach((result, index) => {
        const action = actions[index];
        if (!action) return;
        const actionKey = `${action.action}:${action.listId}`;
        if (result.status === "fulfilled") {
          successfulActions.add(actionKey);
        } else {
          failures.push({ action: action.action, listId: action.listId });
        }
      });

      const finalListIds = new Set(initialListIds);
      actions.forEach((action) => {
        if (!successfulActions.has(`${action.action}:${action.listId}`)) return;
        if (action.action === "add") finalListIds.add(action.listId);
        else finalListIds.delete(action.listId);
      });
      setMemberships((current) => ({
        ...current,
        [datasetId]: [...finalListIds],
      }));

      if (successfulActions.size > 0) void refreshLists();
      return { failures, succeeded: successfulActions.size };
    },
    [memberships, refreshLists]
  );

  const removeDatasetFromList = useCallback(
    (listId: string, datasetId: string) =>
      updateDatasetLists(
        datasetId,
        (memberships[datasetId] ?? []).filter((id) => id !== listId)
      ),
    [memberships, updateDatasetLists]
  );

  const loadListDatasets = useCallback(
    (listId: string): Promise<DatasetPublicResponse[]> =>
      fetchAllFavoriteListDatasets(listId),
    []
  );

  const value = useMemo(
    () => ({
      lists,
      memberships,
      listsLoading,
      listsError,
      refreshLists,
      ensureMemberships,
      createList,
      renameList,
      deleteList,
      updateDatasetLists,
      removeDatasetFromList,
      loadListDatasets,
    }),
    [
      createList,
      deleteList,
      ensureMemberships,
      lists,
      listsError,
      listsLoading,
      loadListDatasets,
      memberships,
      refreshLists,
      removeDatasetFromList,
      renameList,
      updateDatasetLists,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
