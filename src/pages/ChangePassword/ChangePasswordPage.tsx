import React, { useState } from "react";
import { Link } from "react-router-dom";
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

type PasswordField = keyof ChangePasswordFormData;

const getPasswordLengthMessage = (password: string): string => {
  if (password.length === 0) return "Usa una frase larga y única que no emplees en otros servicios.";
  if (password.length < 8) return "Necesita al menos 8 caracteres.";
  if (password.length < 12) return "Buena longitud. Una frase más larga ofrece mayor protección.";
  if (password.length < 16) return "Muy buena longitud para una contraseña única.";
  return "Excelente longitud. Asegúrate de que sea única.";
};

const getPasswordLengthLevel = (password: string): number => {
  if (password.length < 8) return 0;
  if (password.length < 12) return 1;
  if (password.length < 16) return 2;
  return 3;
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
  const [visiblePasswords, setVisiblePasswords] = useState<Record<PasswordField, boolean>>({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const togglePasswordVisibility = (field: PasswordField) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  const hasValidPasswordLength =
    formData.new_password.length >= 8 && formData.new_password.length <= 72;
  const passwordsMatch =
    formData.confirm_password.length > 0 &&
    formData.new_password === formData.confirm_password;
  const usesDifferentPassword =
    formData.current_password.length > 0 &&
    formData.current_password !== formData.new_password;
  const canSubmit =
    formData.current_password.length > 0 &&
    hasValidPasswordLength &&
    passwordsMatch &&
    usesDifferentPassword;
  const passwordLengthLevel = getPasswordLengthLevel(formData.new_password);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!userId) {
      setError("No se encontró el identificador del usuario.");
      return;
    }

    if (!hasValidPasswordLength) {
      setError("La nueva contraseña debe tener entre 8 y 72 caracteres.");
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
              Usa una contraseña larga y única que no emplees en otros servicios.
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
              <div className="change-password-input-wrap">
                <input
                  id="current_password"
                  name="current_password"
                  type={visiblePasswords.current_password ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.current_password}
                  onChange={handleChange}
                  required
                  maxLength={72}
                  placeholder="Ingresa tu contraseña actual"
                />
                <button type="button" className="change-password-visibility" aria-label={`${visiblePasswords.current_password ? "Ocultar" : "Mostrar"} contraseña actual`} aria-pressed={visiblePasswords.current_password} onClick={() => togglePasswordVisibility("current_password")}>
                  {visiblePasswords.current_password ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="change-password-field">
              <label htmlFor="new_password">Nueva contraseña</label>
              <div className="change-password-input-wrap">
                <input
                  id="new_password"
                  name="new_password"
                  type={visiblePasswords.new_password ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={72}
                  placeholder="Mínimo 8 caracteres"
                  aria-describedby="new-password-hint"
                />
                <button type="button" className="change-password-visibility" aria-label={`${visiblePasswords.new_password ? "Ocultar" : "Mostrar"} nueva contraseña`} aria-pressed={visiblePasswords.new_password} onClick={() => togglePasswordVisibility("new_password")}>
                  {visiblePasswords.new_password ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <div id="new-password-hint" className="change-password-length" role="status">
                <span className="change-password-length__bars" aria-hidden="true">
                  {[1, 2, 3].map((level) => <span className={level <= passwordLengthLevel ? "change-password-length__bar change-password-length__bar--active" : "change-password-length__bar"} key={level} />)}
                </span>
                <span>{getPasswordLengthMessage(formData.new_password)}</span>
              </div>
              {formData.new_password.length > 0 && !usesDifferentPassword && (
                <span className="change-password-validation change-password-validation--error" role="status">La nueva contraseña debe ser diferente a la actual.</span>
              )}
            </div>

            <div className="change-password-field">
              <label htmlFor="confirm_password">
                Confirmar nueva contraseña
              </label>
              <div className="change-password-input-wrap">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={visiblePasswords.confirm_password ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={72}
                  placeholder="Repite tu nueva contraseña"
                  aria-describedby={formData.confirm_password ? "confirm-password-feedback" : undefined}
                />
                <button type="button" className="change-password-visibility" aria-label={`${visiblePasswords.confirm_password ? "Ocultar" : "Mostrar"} confirmación de contraseña`} aria-pressed={visiblePasswords.confirm_password} onClick={() => togglePasswordVisibility("confirm_password")}>
                  {visiblePasswords.confirm_password ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {formData.confirm_password && (
                <span id="confirm-password-feedback" className={`change-password-validation${passwordsMatch ? " change-password-validation--success" : " change-password-validation--error"}`} role="status">
                  {passwordsMatch ? "Las contraseñas coinciden." : "Las contraseñas no coinciden."}
                </span>
              )}
            </div>

            <div className="change-password-security-note">
              <strong>Después del cambio</strong>
              <p>Usa tu nueva contraseña en los próximos inicios de sesión y no la compartas con nadie.</p>
            </div>

            <div className="change-password-actions">
              <Link to="/perfil">Volver a mi cuenta</Link>
              <Button type="submit" loading={loading} disabled={!canSubmit}>
                Actualizar contraseña
              </Button>
            </div>
          </form>

        </section>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
