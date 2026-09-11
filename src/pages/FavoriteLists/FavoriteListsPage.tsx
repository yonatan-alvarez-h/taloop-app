import React, { useEffect, useState } from "react";
import AppHeader from "../../components/layout/AppHeader";
import FavoriteButton from "../../components/Favorites/FavoriteButton";
import Loading from "../../components/UI/Loading";
import { ApiError } from "../../services/api";
import type { DatasetPublicResponse, FavoriteList } from "../../types/favorite";
import { useFavorites } from "../../context/useFavorites";
import "./FavoriteListsPage.css";

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError && error.fieldErrors.name) {
    return error.fieldErrors.name;
  }
  return error instanceof Error ? error.message : fallback;
};

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

interface FavoriteDatasetCardProps {
  dataset: DatasetPublicResponse;
  listId: string;
  onRemoved: () => void;
}

const FavoriteDatasetCard: React.FC<FavoriteDatasetCardProps> = ({
  dataset,
  listId,
  onRemoved,
}) => (
  <li className="favorite-dataset-card">
    <div className="favorite-dataset-card__header">
      <div className="favorite-dataset-card__identity">
        <h3 title={dataset.title}>{dataset.title}</h3>
        {dataset.category && (
          <span className="favorite-dataset-card__category">
            {dataset.category}
          </span>
        )}
      </div>
      <FavoriteButton
        datasetId={dataset._id}
        datasetTitle={dataset.title}
        listId={listId}
        onRemoved={onRemoved}
      />
    </div>

    {dataset.tags.length > 0 && (
      <div className="favorite-dataset-card__tags" aria-label="Etiquetas">
        {dataset.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    )}

    <div className="favorite-dataset-card__meta">
      <span>{dataset.visibility}</span>
      <span>{dataset.status}</span>
      <a href={`/datasets/${encodeURIComponent(dataset._id)}`}>
        Ver detalles
      </a>
    </div>
  </li>
);

const FavoriteListsPage: React.FC = () => {
  const {
    lists,
    listsLoading,
    listsError,
    refreshLists,
    createList,
    renameList,
    deleteList,
    loadListDatasets,
  } = useFavorites();
  const [selectedListId, setSelectedListId] = useState("");
  const [favoriteDatasets, setFavoriteDatasets] = useState<
    DatasetPublicResponse[]
  >([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);
  const [datasetsError, setDatasetsError] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newListName, setNewListName] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const selectedList = lists.find((list) => list.id === selectedListId);

  useEffect(() => {
    if (lists.length === 0) {
      if (selectedListId) setSelectedListId("");
      return;
    }

    if (!lists.some((list) => list.id === selectedListId)) {
      setSelectedListId(lists[0]?.id ?? "");
    }
  }, [lists, selectedListId]);

  useEffect(() => {
    if (!selectedListId) {
      setFavoriteDatasets([]);
      setDatasetsError(null);
      return;
    }

    let active = true;
    setDatasetsLoading(true);
    setDatasetsError(null);
    loadListDatasets(selectedListId)
      .then((datasets) => {
        if (active) setFavoriteDatasets(datasets);
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 404) {
          setDatasetsError("Esta lista ya no está disponible.");
          return;
        }
        setDatasetsError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los datasets de esta lista."
        );
      })
      .finally(() => {
        if (active) setDatasetsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadListDatasets, selectedListId]);

  const handleCreateList = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = newListName.trim();
    if (!trimmedName) {
      setActionError("Escribe un nombre para la lista.");
      return;
    }
    if (trimmedName.length > 100) {
      setActionError("El nombre no puede superar los 100 caracteres.");
      return;
    }

    setActionError(null);
    try {
      const list = await createList(trimmedName);
      setNewListName("");
      setSelectedListId(list.id);
    } catch (error) {
      setActionError(
        getRequestErrorMessage(
          error,
          "No se pudo crear la lista. Intenta de nuevo."
        )
      );
    }
  };

  const startRenaming = (list: FavoriteList) => {
    setEditingListId(list.id);
    setEditingName(list.name);
    setActionError(null);
  };

  const handleRename = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingListId) return;
    const trimmedName = editingName.trim();
    if (!trimmedName) {
      setActionError("Escribe un nombre para la lista.");
      return;
    }
    if (trimmedName.length > 100) {
      setActionError("El nombre no puede superar los 100 caracteres.");
      return;
    }

    setActionError(null);
    try {
      await renameList(editingListId, trimmedName);
      setEditingListId(null);
    } catch (error) {
      setActionError(
        getRequestErrorMessage(
          error,
          "No se pudo renombrar la lista. Intenta de nuevo."
        )
      );
    }
  };

  const handleDelete = async (list: FavoriteList) => {
    if (
      !window.confirm(
        `¿Eliminar la lista “${list.name}”? También se quitarán sus favoritos.`
      )
    ) {
      return;
    }

    setActionError(null);
    try {
      await deleteList(list.id);
      if (selectedListId === list.id) setSelectedListId("");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la lista. Intenta de nuevo."
      );
    }
  };

  return (
    <div className="favorite-lists-page">
      <AppHeader />
      <main className="favorite-lists-page__container container">
        <div className="favorite-lists-page__heading">
          <div>
            <p className="favorite-lists-page__eyebrow">Tu espacio personal</p>
            <h1>Mis favoritos</h1>
            <p>Organiza datasets que quieras volver a consultar.</p>
          </div>
          <form className="favorite-list-create" onSubmit={handleCreateList}>
            <label htmlFor="favorite-page-new-list">Nueva lista</label>
            <div>
              <input
                id="favorite-page-new-list"
                type="text"
                value={newListName}
                maxLength={100}
                placeholder="Nombre de la lista"
                onChange={(event) => setNewListName(event.target.value)}
              />
              <button type="submit">Crear lista</button>
            </div>
          </form>
        </div>

        {actionError && (
          <div className="favorite-lists-page__alert" role="alert">
            {actionError}
          </div>
        )}

        {listsError && (
          <div className="favorite-lists-page__alert" role="alert">
            <span>{listsError}</span>
            <button type="button" onClick={() => void refreshLists()}>
              Reintentar
            </button>
          </div>
        )}

        {listsLoading && lists.length === 0 ? (
          <div className="favorite-lists-page__loading">
            <Loading
              size="lg"
              variant="spinner"
              text="Cargando tus listas..."
              color="primary"
            />
          </div>
        ) : lists.length === 0 ? (
          <section className="favorite-lists-empty" aria-live="polite">
            <div className="favorite-lists-empty__icon" aria-hidden="true">
              ♡
            </div>
            <h2>Crea una lista para organizar datasets que quieras revisar</h2>
            <p>También puedes crearla al pulsar el corazón de cualquier dataset.</p>
          </section>
        ) : (
          <div className="favorite-lists-layout">
            <aside className="favorite-lists-sidebar" aria-label="Tus listas">
              <div className="favorite-lists-sidebar__title-row">
                <h2>Listas</h2>
                <span>{lists.length}</span>
              </div>
              <div className="favorite-lists-sidebar__items">
                {lists.map((list) => (
                  <div
                    className={`favorite-list-row${
                      selectedListId === list.id ? " favorite-list-row--active" : ""
                    }`}
                    key={list.id}
                  >
                    {editingListId === list.id ? (
                      <form onSubmit={handleRename} className="favorite-list-row__edit">
                        <input
                          type="text"
                          value={editingName}
                          maxLength={100}
                          aria-label={`Nuevo nombre de ${list.name}`}
                          onChange={(event) => setEditingName(event.target.value)}
                          autoFocus
                        />
                        <button type="submit" aria-label="Guardar nombre">
                          ✓
                        </button>
                        <button
                          type="button"
                          aria-label="Cancelar edición"
                          onClick={() => setEditingListId(null)}
                        >
                          ×
                        </button>
                      </form>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="favorite-list-row__select"
                          onClick={() => setSelectedListId(list.id)}
                        >
                          <span>{list.name}</span>
                          <small>{formatTimestamp(list.updated_at)}</small>
                        </button>
                        <div className="favorite-list-row__actions">
                          <button
                            type="button"
                            aria-label={`Renombrar ${list.name}`}
                            onClick={() => startRenaming(list)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            aria-label={`Eliminar ${list.name}`}
                            onClick={() => void handleDelete(list)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            <section className="favorite-lists-content" aria-live="polite">
              {selectedList && (
                <div className="favorite-lists-content__heading">
                  <div>
                    <h2>{selectedList.name}</h2>
                    <p>
                      Actualizada <time dateTime={selectedList.updated_at}>
                        {formatTimestamp(selectedList.updated_at)}
                      </time>
                    </p>
                  </div>
                  <span className="favorite-lists-content__count">
                    {favoriteDatasets.length} dataset
                    {favoriteDatasets.length === 1 ? "" : "s"}
                  </span>
                </div>
              )}

              {datasetsLoading ? (
                <div className="favorite-lists-content__loading">
                  <Loading
                    size="md"
                    variant="spinner"
                    text="Cargando datasets..."
                    color="primary"
                  />
                </div>
              ) : datasetsError ? (
                <div className="favorite-lists-page__alert" role="alert">
                  {datasetsError}
                </div>
              ) : favoriteDatasets.length === 0 ? (
                <div className="favorite-list-datasets-empty">
                  <span aria-hidden="true">♡</span>
                  <p>Aún no hay datasets disponibles en esta lista</p>
                </div>
              ) : (
                <ul className="favorite-datasets-grid">
                  {favoriteDatasets.map((dataset) => (
                    <FavoriteDatasetCard
                      key={dataset._id}
                      dataset={dataset}
                      listId={selectedListId}
                      onRemoved={() =>
                        setFavoriteDatasets((current) =>
                          current.filter((item) => item._id !== dataset._id)
                        )
                      }
                    />
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoriteListsPage;
