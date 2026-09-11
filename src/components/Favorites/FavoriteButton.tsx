import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useFavorites } from "../../context/useFavorites";
import FavoriteListDialog from "./FavoriteListDialog";
import type { FavoriteMutationResult } from "../../context/favoritesContext";
import type { FavoriteList } from "../../types/favorite";
import "./FavoriteButton.css";

interface FavoriteButtonProps {
  datasetId: string;
  datasetTitle: string;
  listId?: string;
  onRemoved?: () => void;
}

const getMutationError = (result: FavoriteMutationResult, lists: FavoriteList[]) => {
  if (result.failures.length === 0) return null;
  const failedListNames = result.failures.map(
    ({ listId }) => lists.find((list) => list.id === listId)?.name ?? listId
  );
  const updatedMessage = result.succeeded
    ? `Se actualizaron ${result.succeeded} lista${
        result.succeeded === 1 ? "" : "s"
      }. `
    : "";
  return `${updatedMessage}No se pudieron actualizar: ${failedListNames.join(
    ", "
  )}. Puedes reintentarlo.`;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  datasetId,
  datasetTitle,
  listId,
  onRemoved,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    lists,
    memberships,
    listsLoading,
    ensureMemberships,
    createList,
    updateDatasetLists,
  } = useFavorites();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const isFavorite = (memberships[datasetId] ?? []).length > 0;

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActionError(null);

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsBusy(true);
    try {
      const resolved = await ensureMemberships([datasetId]);
      const currentListIds = resolved[datasetId] ?? [];

      if (currentListIds.length > 0) {
        const targetListIds = listId
          ? currentListIds.filter((id) => id !== listId)
          : [];
        const result = await updateDatasetLists(datasetId, targetListIds);
        const error = getMutationError(result, lists);
        if (error) {
          setActionError(error);
        } else {
          onRemoved?.();
        }
        return;
      }

      setDialogError(null);
      setIsDialogOpen(true);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo consultar el estado de favoritos."
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = async (listIds: string[]) => {
    const result = await updateDatasetLists(datasetId, listIds);
    const error = getMutationError(result, lists);
    setDialogError(error);
    if (!error) setActionError(null);
    return !error;
  };

  const handleDialogClose = () => {
    if (isBusy) return;
    setIsDialogOpen(false);
    setDialogError(null);
  };

  return (
    <div className="favorite-button-wrapper">
      <button
        type="button"
        className={`favorite-button${isFavorite ? " favorite-button--active" : ""}`}
        aria-label={
          isFavorite ? "Quitar dataset de favoritos" : "Agregar dataset a favoritos"
        }
        aria-pressed={isFavorite}
        aria-busy={isBusy}
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        onClick={handleClick}
        disabled={isBusy}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20.8 8.6c0 5.2-8.8 10.1-8.8 10.1S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />
        </svg>
      </button>
      {actionError && (
        <span className="favorite-button__error" role="alert">
          {actionError}
        </span>
      )}
      <FavoriteListDialog
        isOpen={isDialogOpen}
        datasetTitle={datasetTitle}
        lists={lists}
        selectedListIds={memberships[datasetId] ?? []}
        listsLoading={listsLoading}
        error={dialogError}
        onClose={handleDialogClose}
        onSave={handleSave}
        onCreateList={createList}
      />
    </div>
  );
};

export default FavoriteButton;
