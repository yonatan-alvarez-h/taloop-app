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
  onRestored?: () => void;
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
  onRestored,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    lists,
    memberships,
    listsLoading,
    ensureMemberships,
    createList,
    showUndoToast,
    updateDatasetLists,
  } = useFavorites();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInitialListIds, setDialogInitialListIds] = useState<string[]>([]);
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

      setDialogError(null);
      setDialogInitialListIds(currentListIds);
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
    const previousListIds = dialogInitialListIds;
    const result = await updateDatasetLists(datasetId, listIds);
    const error = getMutationError(result, lists);
    setDialogError(error);
    if (error) return false;

    setActionError(null);
    setDialogInitialListIds(listIds);

    const wasInCurrentList = listId
      ? previousListIds.includes(listId)
      : false;
    const isInCurrentList = listId ? listIds.includes(listId) : false;
    if (wasInCurrentList && !isInCurrentList) onRemoved?.();
    if (!wasInCurrentList && isInCurrentList) onRestored?.();

    if (result.succeeded > 0) {
      const message = listIds.length === 0
        ? "Dataset eliminado de favoritos."
        : previousListIds.length === 0
          ? `Dataset guardado en ${listIds.length} lista${
              listIds.length === 1 ? "" : "s"
            }.`
          : "Listas de favoritos actualizadas.";

      showUndoToast({
        message,
        action: {
          label: "Ver favoritos",
          onAction: () => navigate("/favoritos"),
        },
        onUndo: async () => {
          const undoResult = await updateDatasetLists(datasetId, previousListIds);
          const undoError = getMutationError(undoResult, lists);
          if (undoError) throw new Error(undoError);

          setDialogInitialListIds(previousListIds);
          if (wasInCurrentList && !isInCurrentList) onRestored?.();
          if (!wasInCurrentList && isInCurrentList) onRemoved?.();
        },
      });
    }

    return true;
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
          isFavorite
            ? "Gestionar listas de favoritos"
            : "Guardar dataset en listas"
        }
        aria-pressed={isFavorite}
        aria-busy={isBusy}
        title={isFavorite ? "Gestionar listas" : "Guardar en listas"}
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
        selectedListIds={dialogInitialListIds}
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
