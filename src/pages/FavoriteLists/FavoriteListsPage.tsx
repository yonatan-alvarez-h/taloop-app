import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

const formatLocalDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Fecha no disponible" :
    new Intl.DateTimeFormat("es-CO", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(date);
};

const ListActions: React.FC<{
  list: FavoriteList;
  onRename: () => void;
  onDelete: () => void;
}> = ({ list, onRename, onDelete }) => {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) {
        ref.current?.removeAttribute("open");
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <details ref={ref} className="favorite-list-actions" onKeyDown={(event) => {
      if (event.key === "Escape") {
        ref.current?.removeAttribute("open");
        ref.current?.querySelector("summary")?.focus();
      }
    }}>
      <summary aria-label={`Acciones de ${list.name}`}>⋯</summary>
      <div className="favorite-list-actions__popover">
        <button type="button" onClick={() => {
          ref.current?.removeAttribute("open");
          onRename();
        }}>Renombrar</button>
        <button type="button" onClick={() => {
          ref.current?.removeAttribute("open");
          ref.current?.querySelector("summary")?.focus();
          onDelete();
        }}>Eliminar</button>
      </div>
    </details>
  );
};

interface FavoriteDatasetCardProps {
  dataset: DatasetPublicResponse;
  listId: string;
  onRemoved: () => void;
  onRestored: () => void;
}

const FavoriteDatasetCard: React.FC<FavoriteDatasetCardProps> = ({
  dataset,
  listId,
  onRemoved,
  onRestored,
}) => {
  const [expandedTags, setExpandedTags] = useState(false);
  return (
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
        onRestored={onRestored}
      />
    </div>

    {dataset.tags.length > 0 && (
      <div className="favorite-dataset-card__tags" aria-label="Etiquetas">
        {(expandedTags ? dataset.tags : dataset.tags.slice(0, 4)).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
        {dataset.tags.length > 4 && (
          <button type="button" aria-expanded={expandedTags}
            onClick={() => setExpandedTags((current) => !current)}>
            {expandedTags ? "Ver menos" : `+${dataset.tags.length - 4} más`}
          </button>
        )}
      </div>
    )}

    <div className="favorite-dataset-card__meta">
      <span>{{ public: "Público", private: "Privado", unlisted: "No listado" }[dataset.visibility]}</span>
      <span>{{ active: "Activo", draft: "Borrador", suspended: "Suspendido", archived: "Archivado" }[dataset.status]}</span>
      <Link to={`/datasets/${encodeURIComponent(dataset._id)}`}>
        Ver detalles
      </Link>
    </div>
  </li>
);
};

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const createTriggerRef = useRef<HTMLButtonElement>(null);
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
    if (isCreating) return;
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
    setIsCreating(true);
    try {
      const list = await createList(trimmedName);
      setNewListName("");
      setSelectedListId(list.id);
      setIsCreateOpen(false);
      createTriggerRef.current?.focus();
    } catch (error) {
      setActionError(
        getRequestErrorMessage(
          error,
          "No se pudo crear la lista. Intenta de nuevo."
        )
      );
    } finally {
      setIsCreating(false);
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
        ) : (
          <div className="favorite-lists-layout">
            <aside className="favorite-lists-sidebar" aria-label="Tus listas">
              <div className="favorite-lists-sidebar__title-row">
                <h2>Listas</h2>
                <span>{lists.length}</span>
              </div>
              <button type="button" ref={createTriggerRef}
                className="favorite-lists-sidebar__new"
                aria-expanded={isCreateOpen} aria-controls="favorite-create-form"
                onClick={() => setIsCreateOpen((current) => !current)}>
                + Nueva lista
              </button>
              {isCreateOpen && (
                <form id="favorite-create-form" className="favorite-list-create"
                  onSubmit={handleCreateList}>
                  <label htmlFor="favorite-page-new-list">Nombre de la lista</label>
                  <input id="favorite-page-new-list" type="text" autoFocus
                    value={newListName} maxLength={100} disabled={isCreating}
                    placeholder="Ej. Para investigar"
                    onChange={(event) => setNewListName(event.target.value)} />
                  <div>
                    <button type="submit" disabled={isCreating}>
                      {isCreating ? "Creando…" : "Crear"}
                    </button>
                    <button type="button" disabled={isCreating}
                      className="favorite-list-create__cancel" onClick={() => {
                        setIsCreateOpen(false);
                        createTriggerRef.current?.focus();
                      }}>Cancelar</button>
                  </div>
                </form>
              )}
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
                          aria-current={selectedListId === list.id ? "true" : undefined}
                          onClick={() => setSelectedListId(list.id)}
                        >
                          <span>{list.name}</span>
                          <small><time dateTime={list.updated_at}
                            title={formatTimestamp(list.updated_at)}>
                            {formatLocalDate(list.updated_at)}
                          </time></small>
                        </button>
                        <ListActions list={list}
                          onRename={() => startRenaming(list)}
                          onDelete={() => void handleDelete(list)} />
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
                        {formatLocalDate(selectedList.updated_at)}
                      </time>
                    </p>
                    <details className="favorite-list-timestamps">
                      <summary>Ver fechas UTC</summary>
                      <dl>
                        <dt>Creada</dt><dd><time dateTime={selectedList.created_at}>{formatTimestamp(selectedList.created_at)}</time></dd>
                        <dt>Actualizada</dt><dd><time dateTime={selectedList.updated_at}>{formatTimestamp(selectedList.updated_at)}</time></dd>
                      </dl>
                    </details>
                  </div>
                  <span className="favorite-lists-content__count">
                    {datasetsLoading ? "…" : favoriteDatasets.length} dataset
                    {favoriteDatasets.length === 1 ? "" : "s"}
                  </span>
                </div>
              )}

              {lists.length === 0 && !listsError ? (
                <div className="favorite-lists-empty">
                  <div className="favorite-lists-empty__icon" aria-hidden="true">♡</div>
                  <h2>Crea una lista para organizar datasets que quieras revisar</h2>
                  <p>Usa “+ Nueva lista” o el corazón de cualquier dataset.</p>
                </div>
              ) : datasetsLoading ? (
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
                      onRestored={() =>
                        setFavoriteDatasets((current) =>
                          current.some((item) => item._id === dataset._id)
                            ? current
                            : [...current, dataset]
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
