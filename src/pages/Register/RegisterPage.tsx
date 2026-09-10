import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/Menu/Nav/NavBar";
import Button from "../../components/UI/Button";
import { createUser } from "../../services/usersService";
import type { UserRegistrationData } from "../../types/user";
import "./RegisterPage.css";

interface RegisterFormData extends UserRegistrationData {
  confirmPassword: string;
}

const initialFormData: RegisterFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  full_name: "",
  interests: [],
};

const isValidFullName = (fullName: string): boolean => {
  const normalizedFullName = fullName.trim();
  const letters = normalizedFullName.match(/\p{L}/gu) ?? [];

  return (
    letters.length >= 2 && /^\p{L}+(?:[ .'-]+\p{L}+)*$/u.test(normalizedFullName)
  );
};

const isStrongPassword = (password: string): boolean => {
  const commonWeakPasswords = new Set([
    "12345678",
    "password",
    "qwerty123",
    "abcdefgh",
  ]);

  return (
    password.length >= 8 &&
    password.length <= 72 &&
    !commonWeakPasswords.has(password.toLowerCase()) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
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

    if (!isValidFullName(formData.full_name)) {
      setError(
        "Ingresa un nombre completo válido con al menos dos letras."
      );
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError(
        "La contraseña debe tener entre 8 y 72 caracteres, incluyendo mayúscula, minúscula, número y símbolo."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await createUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        interests: formData.interests,
      });
      setSuccess(true);
      setFormData(initialFormData);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear el usuario. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <nav className="navbar register-navbar">
        <NavBar />
        <Link to="/login" className="register-navbar-link">
          ← Iniciar sesión
        </Link>
      </nav>

      <main className="register-content">
        <section className="register-card" aria-labelledby="register-title">
          <div className="register-card-header">
            <span className="register-eyebrow">Únete a taloop</span>
            <h1 id="register-title">Crea tu cuenta</h1>
            <p>Regístrate para explorar y gestionar datasets.</p>
          </div>

          {success && (
            <div className="register-message register-message--success" role="status">
              Tu cuenta fue creada correctamente. Ya puedes iniciar sesión.
            </div>
          )}

          {error && (
            <div className="register-message register-message--error" role="alert">
              {error}
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field">
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

            <div className="register-field">
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

            <div className="register-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                aria-describedby="password-help"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={72}
                placeholder="Mayúscula, número y símbolo"
              />
              <small id="password-help" className="register-field-hint">
                Usa mayúsculas, minúsculas, números y símbolos.
              </small>
            </div>

            <div className="register-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Repite tu contraseña"
              />
            </div>

            <fieldset className="register-interests">
              <legend>¿Cómo quieres usar taloop?</legend>
              <p className="register-field-hint">
                Puedes elegir una opción o ambas. Esto personaliza tu experiencia;
                no cambia tus permisos.
              </p>
              <label className="register-interest-option">
                <input
                  type="checkbox"
                  checked={formData.interests.includes("consume")}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      interests: event.target.checked
                        ? [...current.interests, "consume"]
                        : current.interests.filter((interest) => interest !== "consume"),
                    }))
                  }
                />
                <span>Explorar y consumir datos</span>
              </label>
              <label className="register-interest-option">
                <input
                  type="checkbox"
                  checked={formData.interests.includes("provide")}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      interests: event.target.checked
                        ? [...current.interests, "provide"]
                        : current.interests.filter((interest) => interest !== "provide"),
                    }))
                  }
                />
                <span>Proveer y gestionar datos</span>
              </label>
            </fieldset>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Crear cuenta
            </Button>
          </form>

          <p className="register-footer">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;
