import React from "react";
import "./Button.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}) => {
  const baseClass = "btn-unified";
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const loadingClass = loading ? `${baseClass}--loading` : "";
  const fullWidthClass = fullWidth ? `${baseClass}--full-width` : "";
  const disabledClass = disabled || loading ? `${baseClass}--disabled` : "";

  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    fullWidthClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} disabled={disabled || loading} {...props}>
      {loading && (
        <span className={`${baseClass}__spinner`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={`${baseClass}__spinner-icon`}>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            />
          </svg>
        </span>
      )}

      {leftIcon && !loading && (
        <span className={`${baseClass}__icon ${baseClass}__icon--left`}>
          {leftIcon}
        </span>
      )}

      <span className={`${baseClass}__content`}>{children}</span>

      {rightIcon && !loading && (
        <span className={`${baseClass}__icon ${baseClass}__icon--right`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
