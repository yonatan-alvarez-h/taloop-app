import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Button from "../../components/UI/Button";
import Loading from "../../components/UI/Loading";
import { useAuth } from "../../context/useAuth";
import { ApiError } from "../../services/api";
import {
  getCurrentUser,
  requestEmailVerification,
  updateCurrentUser,
  verifyEmail,
} from "../../services/usersService";
import type { UserInterest, UserProfile } from "../../types/user";
import "./ProfilePage.css";

const initialFormData: UserProfile = {
  email: "",
  full_name: "",
  interests: [],
};

const INTEREST_OPTIONS: Array<{
  value: UserInterest;
  title: string;
  description: string;
}> = [
  {
    value: "consume",
    title: "Explorar y usar datos",
    description: "Encuentra datasets para tus análisis y proyectos.",
  },
  {
    value: "provide",
    title: "Publicar y compartir datos",
    description: "Organiza y comparte datasets con tu equipo.",
  },
];

const isValidFullName = (fullName: string): boolean => {
  const normalizedFullName = fullName.trim();
  const letters = normalizedFullName.match(/\p{L}/gu) ?? [];

  return (
    letters.length >= 2 && /^\p{L}+(?:[ .'-]+\p{L}+)*$/u.test(normalizedFullName)
  );
};

const ProfilePage: React.FC = () => {
  const {
    accessToken,
    userId: authenticatedUserId,
    updateProfile,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const userId = authenticatedUserId;
  const [formData, setFormData] = useState<UserProfile>(initialFormData);
  const [savedProfile, setSavedProfile] = useState<UserProfile>(initialFormData);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [showVerificationCodeForm, setShowVerificationCodeForm] = useState(false);
  const [confirmingVerification, setConfirmingVerification] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError("No se encontró el identificador del usuario.");
      setInitialLoading(false);
      return;
    }

    let active = true;
    setInitialLoading(true);
    setError(null);

    getCurrentUser(accessToken)
      .then((profile) => {
        if (active) {
          setFormData(profile);
          setSavedProfile(profile);
        }
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
              : "No se pudieron cargar tus datos. Intenta de nuevo."
          );
        }
      })
      .finally(() => {
        if (active) setInitialLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, logout, navigate, userId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const toggleInterest = (interest: UserInterest) => {
    setFormData((current) => {
      const interests = current.interests ?? [];

      return {
        ...current,
        interests: interests.includes(interest)
          ? interests.filter((item) => item !== interest)
          : [...interests, interest],
      };
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!userId) {
      setError("No se encontró el identificador del usuario.");
      return;
    }

    const updatedProfile: UserProfile = {
      ...formData,
      full_name: formData.full_name?.trim() ?? "",
      interests: formData.interests,
    };

    if (!isValidFullName(updatedProfile.full_name ?? "")) {
      setError("Ingresa un nombre completo válido con al menos dos letras.");
      return;
    }

    setLoading(true);

    try {
      const savedProfile = await updateCurrentUser(
        {
          full_name: updatedProfile.full_name ?? undefined,
          interests: updatedProfile.interests,
        },
        accessToken
      );
      setFormData(savedProfile);
      setSavedProfile(savedProfile);
      updateProfile(savedProfile);
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
          : "No se pudieron actualizar tus datos. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    setVerificationLoading(true);
    setVerificationMessage(null);
    setVerificationError(null);
    try {
      await requestEmailVerification(accessToken);
      setShowVerificationCodeForm(true);
      setVerificationMessage(`Enviamos un código de verificación a ${formData.email}.`);
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setVerificationError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo solicitar la verificación. Intenta de nuevo."
      );
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmingVerification(true);
    setVerificationMessage(null);
    setVerificationError(null);
    try {
      const profile = await verifyEmail(verificationToken.trim(), accessToken);
      setFormData((current) => ({
        ...current,
        email_verified_at: profile.email_verified_at,
      }));
      setSavedProfile(profile);
      updateProfile(profile);
      setVerificationToken("");
      setVerificationMessage("Tu correo fue verificado correctamente.");
    } catch (requestError) {
      setVerificationError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo verificar el correo."
      );
    } finally {
      setConfirmingVerification(false);
    }
  };

  const currentInterests = formData.interests ?? [];
  const savedInterests = savedProfile.interests ?? [];
  const hasUnsavedChanges =
    (formData.full_name?.trim() ?? "") !== (savedProfile.full_name?.trim() ?? "") ||
    currentInterests.length !== savedInterests.length ||
    currentInterests.some((interest) => !savedInterests.includes(interest));

  return (
    <div className="profile-page">
      <AppHeader />

      <main className="profile-content">
        <section className="profile-card" aria-labelledby="profile-title">
          <div className="profile-card-header">
            <span className="profile-eyebrow">Tu cuenta</span>
            <h1 id="profile-title">Datos de tu cuenta</h1>
            <p>Actualiza tu información y personaliza cómo usas taloop.</p>
          </div>

          {initialLoading ? (
            <div className="profile-loading">
              <Loading size="lg" text="Cargando tus datos..." />
            </div>
          ) : (
            <>
              {success && (
                <div className="profile-message profile-message--success" role="status">
                  Los cambios en tu cuenta se guardaron correctamente.
                </div>
              )}

              {error && (
                <div className="profile-message profile-message--error" role="alert">
                  {error}
                </div>
              )}

              <div
                className={`profile-verification ${
                  formData.email_verified_at
                    ? "profile-verification--verified"
                    : "profile-verification--pending"
                }`}
              >
                <div className="profile-verification__copy">
                  <span className="profile-verification__status">
                    {formData.email_verified_at ? "Correo verificado" : "Correo sin verificar"}
                  </span>
                  <h2>{formData.email_verified_at ? "Tu correo está listo" : "Verifica tu correo"}</h2>
                  <p>
                    {formData.email_verified_at
                      ? `${formData.email} está verificado.`
                      : `Confirma ${formData.email} para poder aceptar invitaciones de proveedores.`}
                  </p>
                </div>
                {!formData.email_verified_at && (
                  <div className="profile-verification__actions">
                    {showVerificationCodeForm ? (
                      <form className="profile-verification-form" onSubmit={handleVerifyEmail}>
                        <label htmlFor="verification-token">Código de verificación</label>
                        <div className="profile-verification-form__controls">
                          <input
                            id="verification-token"
                            value={verificationToken}
                            onChange={(event) => setVerificationToken(event.target.value)}
                            autoComplete="one-time-code"
                            placeholder="Ingresa el código"
                            required
                          />
                          <Button type="submit" size="sm" loading={confirmingVerification}>Verificar código</Button>
                        </div>
                        <div className="profile-verification-form__help">
                          <span>Revisa tu bandeja de entrada y el correo no deseado.</span>
                          <Button type="button" variant="link" size="sm" loading={verificationLoading} onClick={() => void handleRequestVerification()}>Reenviar código</Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          loading={verificationLoading}
                          onClick={() => void handleRequestVerification()}
                        >
                          Enviar código
                        </Button>
                        <Button type="button" variant="link" size="sm" onClick={() => setShowVerificationCodeForm(true)}>
                          Ya tengo un código
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {verificationMessage && (
                <div className="profile-message profile-message--info" role="status">
                  {verificationMessage}
                </div>
              )}

              {verificationError && (
                <div className="profile-message profile-message--error" role="alert">
                  {verificationError}
                </div>
              )}

              <form className="profile-form" onSubmit={handleSubmit}>
                <section className="profile-section" aria-labelledby="profile-details-title">
                  <h2 id="profile-details-title">Perfil</h2>
                  <div className="profile-field">
                    <label htmlFor="full_name">Nombre completo</label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      autoComplete="name"
                      value={formData.full_name ?? ""}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre"
                    />
                  </div>

                  <section className="profile-account-email" aria-labelledby="profile-email-title">
                    <span id="profile-email-title">Correo electrónico</span>
                    <strong>{formData.email}</strong>
                    <p>Se usa para iniciar sesión y por ahora no puede modificarse.</p>
                  </section>
                </section>

                <fieldset className="profile-preferences" aria-describedby="preferences-hint">
                  <legend>¿Qué quieres hacer en taloop?</legend>
                  <p id="preferences-hint" className="profile-preferences__hint">
                    Personalizaremos tu experiencia con esta selección. No cambia tus permisos.
                  </p>
                  <div className="profile-preferences__options">
                    {INTEREST_OPTIONS.map((option) => {
                      const selected = formData.interests?.includes(option.value) ?? false;

                      return (
                        <label
                          className={`profile-preference${selected ? " profile-preference--selected" : ""}`}
                          key={option.value}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleInterest(option.value)}
                          />
                          <span className="profile-preference__copy">
                            <strong>{option.title}</strong>
                            <span>{option.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="profile-save-bar">
                  <span className="profile-save-bar__status" role="status">
                    {hasUnsavedChanges ? "Cambios sin guardar" : "Todos los cambios están guardados"}
                  </span>
                  <Button type="submit" loading={loading} disabled={!hasUnsavedChanges}>
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </>
          )}

        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
