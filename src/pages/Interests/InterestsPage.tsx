import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Button from "../../components/UI/Button";
import Loading from "../../components/UI/Loading";
import { useAuth } from "../../context/useAuth";
import { ApiError } from "../../services/api";
import { getCurrentUser, updateCurrentUser } from "../../services/usersService";
import type { UserInterest } from "../../types/user";
import "../WorkspacePage.css";

const INTEREST_OPTIONS: Array<{
  value: UserInterest;
  title: string;
  description: string;
}> = [
  {
    value: "consume",
    title: "Consumir datos",
    description: "Explorar el catálogo y encontrar datasets para tus proyectos.",
  },
  {
    value: "provide",
    title: "Proveer datos",
    description: "Crear owners y publicar datasets con un contexto de permisos.",
  },
];

const InterestsPage: React.FC = () => {
  const { accessToken, userProfile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [interests, setInterests] = useState<UserInterest[]>(
    userProfile?.interests ?? []
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCurrentUser(accessToken)
      .then((profile) => {
        if (active) setInterests(profile.interests ?? []);
      })
      .catch((requestError) => {
        if (active) {
          if (requestError instanceof ApiError && requestError.status === 401) {
            logout();
            navigate("/login", { replace: true });
            return;
          }
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar tus intereses."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, logout, navigate]);

  const toggleInterest = (interest: UserInterest) => {
    setSuccess(false);
    setError(null);
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const profile = await updateCurrentUser({ interests }, accessToken);
      updateProfile(profile);
      setInterests(profile.interests ?? []);
      setSuccess(true);
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron guardar tus intereses."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="workspace-page">
      <AppHeader />
      <main className="workspace-content workspace-content--narrow">
        <Link to="/" className="workspace-back-link">
          ← Volver al catálogo
        </Link>
        <section className="workspace-card" aria-labelledby="interests-title">
          <div className="workspace-card__header">
            <span className="workspace-eyebrow">Preferencias</span>
            <h1 id="interests-title">Mis intereses</h1>
            <p>
              Elige cómo quieres usar taloop. Estas preferencias no conceden ni
              quitan permisos sobre owners o datasets.
            </p>
          </div>

          {loading ? (
            <Loading size="lg" text="Cargando tus intereses..." />
          ) : (
            <form onSubmit={handleSubmit}>
              {success && (
                <div className="workspace-message workspace-message--success" role="status">
                  Tus intereses se guardaron correctamente.
                </div>
              )}
              {error && (
                <div className="workspace-message workspace-message--error" role="alert">
                  {error}
                </div>
              )}
              <div className="interest-options">
                {INTEREST_OPTIONS.map((option) => {
                  const selected = interests.includes(option.value);
                  return (
                    <label
                      className={`interest-option${selected ? " interest-option--selected" : ""}`}
                      key={option.value}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleInterest(option.value)}
                      />
                      <span className="interest-option__copy">
                        <strong>{option.title}</strong>
                        <span>{option.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <Button type="submit" fullWidth size="lg" loading={saving}>
                Guardar preferencias
              </Button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default InterestsPage;
