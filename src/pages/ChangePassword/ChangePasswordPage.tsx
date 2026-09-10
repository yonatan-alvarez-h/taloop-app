import React, { useState } from "react";
import AppHeader from "../../components/layout/AppHeader";
import Button from "../../components/UI/Button";
import { useAuth } from "../../context/useAuth";
import {
  changeUserPassword,
  type ChangePasswordData,
} from "../../services/usersService";
import "./ChangePasswordPage.css";

interface ChangePasswordFormData extends ChangePasswordData {
  confirm_password: string;
}

const initialFormData: ChangePasswordFormData = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const ChangePasswordPage: React.FC = () => {
  const { accessToken, userId: authenticatedUserId } = useAuth();
  const userId = authenticatedUserId;
  const [formData, setFormData] = useState<ChangePasswordFormData>(
    initialFormData
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!userId) {
      setError("No se encontró el identificador del usuario.");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (formData.current_password === formData.new_password) {
      setError("La nueva contraseña debe ser diferente a la actual.");
      return;
    }

    setLoading(true);

    try {
      await changeUserPassword(
        userId,
        {
          current_password: formData.current_password,
          new_password: formData.new_password,
        },
        accessToken
      );
      setSuccess(true);
      setFormData(initialFormData);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar la contraseña. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <AppHeader />

      <main className="change-password-content">
        <section
          className="change-password-card"
          aria-labelledby="change-password-title"
        >
          <div className="change-password-card-header">
            <span className="change-password-eyebrow">Seguridad de la cuenta</span>
            <h1 id="change-password-title">Cambia tu contraseña</h1>
            <p>
              Actualiza tu contraseña para mantener tu cuenta protegida.
            </p>
          </div>

          {success && (
            <div
              className="change-password-message change-password-message--success"
              role="status"
            >
              Tu contraseña fue actualizada correctamente.
            </div>
          )}

          {error && (
            <div
              className="change-password-message change-password-message--error"
              role="alert"
            >
              {error}
            </div>
          )}

          <form className="change-password-form" onSubmit={handleSubmit}>
            <div className="change-password-field">
              <label htmlFor="current_password">Contraseña actual</label>
              <input
                id="current_password"
                name="current_password"
                type="password"
                autoComplete="current-password"
                value={formData.current_password}
                onChange={handleChange}
                required
                maxLength={72}
                placeholder="Ingresa tu contraseña actual"
              />
            </div>

            <div className="change-password-field">
              <label htmlFor="new_password">Nueva contraseña</label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                autoComplete="new-password"
                value={formData.new_password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={72}
                placeholder="Mínimo 8 caracteres"
              />
              <span className="change-password-hint">
                Usa entre 8 y 72 caracteres.
              </span>
            </div>

            <div className="change-password-field">
              <label htmlFor="confirm_password">
                Confirmar nueva contraseña
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={72}
                placeholder="Repite tu nueva contraseña"
              />
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Actualizar contraseña
            </Button>
          </form>

        </section>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
