import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../../components/Menu/Nav/NavBar";
import Button from "../../components/UI/Button";
import Loading from "../../components/UI/Loading";
import { useAuth } from "../../context/useAuth";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/usersService";
import type { UserProfile } from "../../types/user";
import "./ProfilePage.css";

const initialFormData: UserProfile = {
  email: "",
  full_name: "",
};

const isValidFullName = (fullName: string): boolean => {
  const normalizedFullName = fullName.trim();
  const letters = normalizedFullName.match(/\p{L}/gu) ?? [];

  return (
    letters.length >= 2 && /^\p{L}+(?:[ .'-]+\p{L}+)*$/u.test(normalizedFullName)
  );
};

const ProfilePage: React.FC = () => {
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const { accessToken, userId: authenticatedUserId } = useAuth();
  const userId = routeUserId ?? authenticatedUserId;
  const [formData, setFormData] = useState<UserProfile>(initialFormData);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError("No se encontró el identificador del usuario.");
      setInitialLoading(false);
      return;
    }

    let active = true;
    setInitialLoading(true);
    setError(null);

    getUserProfile(userId, accessToken)
      .then((profile) => {
        if (active) setFormData(profile);
      })
      .catch((requestError) => {
        if (active) {
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
  }, [accessToken, userId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
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
      email: formData.email.trim().toLowerCase(),
      full_name: formData.full_name.trim(),
    };

    if (!isValidFullName(updatedProfile.full_name)) {
      setError("Ingresa un nombre completo válido con al menos dos letras.");
      return;
    }

    if (!updatedProfile.email) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);

    try {
      await updateUserProfile(userId, updatedProfile, accessToken);
      setFormData(updatedProfile);
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron actualizar tus datos. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <nav className="navbar profile-navbar">
        <NavBar />
        <Link to="/" className="profile-navbar-link">
          ← Explorar datasets
        </Link>
      </nav>

      <main className="profile-content">
        <section className="profile-card" aria-labelledby="profile-title">
          <div className="profile-card-header">
            <span className="profile-eyebrow">Tu cuenta</span>
            <h1 id="profile-title">Modificar datos personales</h1>
            <p>Actualiza la información asociada a tu cuenta.</p>
          </div>

          {initialLoading ? (
            <div className="profile-loading">
              <Loading size="lg" text="Cargando tus datos..." />
            </div>
          ) : (
            <>
              {success && (
                <div className="profile-message profile-message--success" role="status">
                  Tus datos fueron actualizados correctamente.
                </div>
              )}

              {error && (
                <div className="profile-message profile-message--error" role="alert">
                  {error}
                </div>
              )}

              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-field">
                  <label htmlFor="full_name">Nombre completo</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@correo.com"
                  />
                </div>

                <Button type="submit" fullWidth size="lg" loading={loading}>
                  Guardar cambios
                </Button>
              </form>
            </>
          )}

          <p className="profile-footer">
            ¿Quieres volver? <Link to="/">Explorar datasets</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
