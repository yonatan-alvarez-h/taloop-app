import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/Menu/Nav/NavBar";
import Button from "../../components/UI/Button";
import { useAuth } from "../../context/useAuth";
import { loginUser } from "../../services/usersService";
import "./LoginPage.css";

interface LoginFormData {
  email: string;
  password: string;
}

interface RedirectLocation {
  pathname?: string;
  search?: string;
  hash?: string;
}

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      login(response.access_token, response.user_id);

      const state = location.state as { from?: RedirectLocation } | null;
      const from = state?.from;
      const redirectTo = from
        ? `${from.pathname ?? "/"}${from.search ?? ""}${from.hash ?? ""}`
        : "/";

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo iniciar sesión. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <nav className="navbar login-navbar">
        <NavBar />
        <Link to="/register" className="login-navbar-link">
          Crear cuenta
        </Link>
      </nav>

      <main className="login-content">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-card-header">
            <span className="login-eyebrow">Bienvenido a taloop</span>
            <h1 id="login-title">Inicia sesión</h1>
            <p>Accede para explorar y gestionar datasets.</p>
          </div>

          {error && (
            <div className="login-message login-message--error" role="alert">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
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

            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Tu contraseña"
              />
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Iniciar sesión
            </Button>
          </form>

          <p className="login-footer">
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
