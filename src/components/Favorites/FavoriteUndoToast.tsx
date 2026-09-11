import React, { useEffect, useState } from "react";
import type { FavoriteUndoToast as FavoriteUndoToastData } from "../../context/favoritesContext";
import "./FavoriteUndoToast.css";

interface FavoriteUndoToastProps {
  toast: FavoriteUndoToastData | null;
  onDismiss: () => void;
}

const FavoriteUndoToast: React.FC<FavoriteUndoToastProps> = ({
  toast,
  onDismiss,
}) => {
  const [isUndoing, setIsUndoing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsUndoing(false);
    setError(null);
  }, [toast]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(timeout);
  }, [onDismiss, toast]);

  if (!toast) return null;

  const handleUndo = async () => {
    setIsUndoing(true);
    setError(null);
    try {
      await toast.onUndo();
      onDismiss();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo restaurar el favorito."
      );
    } finally {
      setIsUndoing(false);
    }
  };

  return (
    <div className="favorite-undo-toast" role={error ? "alert" : "status"}>
      <p>{error ?? toast.message}</p>
      {!error && (
        <button type="button" onClick={() => void handleUndo()} disabled={isUndoing}>
          {isUndoing ? "Restaurando..." : "Deshacer"}
        </button>
      )}
      <button
        type="button"
        className="favorite-undo-toast__close"
        aria-label="Cerrar aviso"
        onClick={onDismiss}
        disabled={isUndoing}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
};

export default FavoriteUndoToast;
