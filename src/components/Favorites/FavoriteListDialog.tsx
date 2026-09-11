import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ApiError } from "../../services/api";
import type { FavoriteList } from "../../types/favorite";
import "./FavoriteListDialog.css";

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError && error.fieldErrors.name) {
    return error.fieldErrors.name;
  }
  return error instanceof Error ? error.message : fallback;
};

interface FavoriteListDialogProps {
  isOpen: boolean;
  datasetTitle: string;
  lists: FavoriteList[];
  selectedListIds: string[];
  listsLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (listIds: string[]) => Promise<boolean>;
  onCreateList: (name: string) => Promise<FavoriteList>;
}

const FavoriteListDialog: React.FC<FavoriteListDialogProps> = ({
  isOpen,
  datasetTitle,
  lists,
  selectedListIds,
  listsLoading,
  error,
  onClose,
  onSave,
  onCreateList,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedListIds);
  const [newListName, setNewListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const selectedListIdsRef = useRef(selectedListIds);
  selectedListIdsRef.current = selectedListIds;

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds(selectedListIdsRef.current);
    setNewListName("");
    setFormError(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isCreating && !isSaving) onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCreating, isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const toggleList = (listId: string) => {
    setSelectedIds((current) =>
      current.includes(listId)
        ? current.filter((id) => id !== listId)
        : [...current, listId]
    );
  };

  const handleCreateList = async () => {
    const trimmedName = newListName.trim();
    if (!trimmedName) {
      setFormError("Escribe un nombre para la lista.");
      return;
    }
    if (trimmedName.length > 100) {
      setFormError("El nombre no puede superar los 100 caracteres.");
      return;
    }

    setIsCreating(true);
    setFormError(null);
    try {
      const createdList = await onCreateList(trimmedName);
      setSelectedIds((current) => [...current, createdList.id]);
      setNewListName("");
    } catch (requestError) {
      setFormError(
        getRequestErrorMessage(
          requestError,
          "No se pudo crear la lista. Intenta de nuevo."
        )
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIds.length === 0) {
      setFormError("Selecciona o crea una lista para guardar el dataset.");
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      const saved = await onSave(selectedIds);
      if (saved) onClose();
    } catch (requestError) {
      setFormError(
        getRequestErrorMessage(
          requestError,
          "No se pudo guardar el favorito. Intenta de nuevo."
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="favorite-dialog-layer">
      <button
        type="button"
        className="favorite-dialog-backdrop"
        aria-label="Cerrar selector de favoritos"
        onClick={isSaving || isCreating ? undefined : onClose}
      />
      <section
        className="favorite-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorite-dialog-title"
      >
        <div className="favorite-dialog__header">
          <div>
            <p className="favorite-dialog__eyebrow">Mis favoritos</p>
            <h2 id="favorite-dialog-title">Guardar dataset</h2>
            <p className="favorite-dialog__dataset" title={datasetTitle}>
              {datasetTitle}
            </p>
          </div>
          <button
            type="button"
            className="favorite-dialog__close"
            aria-label="Cerrar selector de favoritos"
            onClick={onClose}
            disabled={isSaving || isCreating}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset className="favorite-dialog__lists">
            <legend>Selecciona una o más listas</legend>
            {listsLoading ? (
              <p className="favorite-dialog__muted">Cargando tus listas...</p>
            ) : lists.length === 0 ? (
              <p className="favorite-dialog__muted">
                Todavía no tienes listas. Crea una para guardar este dataset.
              </p>
            ) : (
              lists.map((list) => (
                <label className="favorite-dialog__list" key={list.id}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(list.id)}
                    onChange={() => toggleList(list.id)}
                    disabled={isSaving || isCreating}
                  />
                  <span>{list.name}</span>
                </label>
              ))
            )}
          </fieldset>

          <div className="favorite-dialog__create">
            <label htmlFor="favorite-new-list-name">Crear una lista nueva</label>
            <div className="favorite-dialog__create-row">
              <input
                id="favorite-new-list-name"
                type="text"
                value={newListName}
                maxLength={100}
                placeholder="Ej. Revisar esta semana"
                onChange={(event) => setNewListName(event.target.value)}
                disabled={isSaving || isCreating}
              />
              <button
                type="button"
                className="favorite-dialog__create-button"
                onClick={() => void handleCreateList()}
                disabled={isSaving || isCreating}
              >
                {isCreating ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>

          {(formError || error) && (
            <p className="favorite-dialog__error" role="alert">
              {formError ?? error}
            </p>
          )}

          <div className="favorite-dialog__actions">
            <button
              type="button"
              className="favorite-dialog__cancel"
              onClick={onClose}
              disabled={isSaving || isCreating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="favorite-dialog__save"
              disabled={isSaving || isCreating || listsLoading}
            >
              {isSaving ? "Guardando..." : "Guardar en favoritos"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
};

export default FavoriteListDialog;
