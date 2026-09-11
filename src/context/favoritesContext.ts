import { createContext } from "react";
import type { DatasetPublicResponse, FavoriteList } from "../types/favorite";

export interface FavoriteMutationFailure {
  action: "add" | "remove";
  listId: string;
}

export interface FavoriteMutationResult {
  failures: FavoriteMutationFailure[];
  succeeded: number;
}

export interface FavoritesContextValue {
  lists: FavoriteList[];
  memberships: Record<string, string[]>;
  listsLoading: boolean;
  listsError: string | null;
  refreshLists: () => Promise<void>;
  ensureMemberships: (datasetIds: string[]) => Promise<Record<string, string[]>>;
  createList: (name: string) => Promise<FavoriteList>;
  renameList: (listId: string, name: string) => Promise<FavoriteList>;
  deleteList: (listId: string) => Promise<void>;
  updateDatasetLists: (
    datasetId: string,
    listIds: string[]
  ) => Promise<FavoriteMutationResult>;
  removeDatasetFromList: (
    listId: string,
    datasetId: string
  ) => Promise<FavoriteMutationResult>;
  loadListDatasets: (listId: string) => Promise<DatasetPublicResponse[]>;
}

export const FavoritesContext = createContext<
  FavoritesContextValue | undefined
>(undefined);
