import React from "react";
import "./Loading.css";

export interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  color?: "primary" | "secondary" | "neutral";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  variant = "spinner",
  color = "primary",
  text,
  fullScreen = false,
  className = "",
}) => {
  const baseClass = "loading";
  const sizeClass = `${baseClass}--${size}`;
  const variantClass = `${baseClass}--${variant}`;
  const colorClass = `${baseClass}--${color}`;
  const fullScreenClass = fullScreen ? `${baseClass}--fullscreen` : "";

  const loadingClass = [
    baseClass,
    sizeClass,
    variantClass,
    colorClass,
    fullScreenClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderSpinner = () => (
    <div className={`${baseClass}__spinner`}>
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
    </div>
  );

  const renderDots = () => (
    <div className={`${baseClass}__dots`}>
      <div className={`${baseClass}__dot`}></div>
      <div className={`${baseClass}__dot`}></div>
      <div className={`${baseClass}__dot`}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`${baseClass}__pulse`}>
      <div className={`${baseClass}__pulse-circle`}></div>
    </div>
  );

  const renderSkeleton = () => (
    <div className={`${baseClass}__skeleton`}>
      <div
        className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--long`}
      ></div>
      <div
        className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--medium`}
      ></div>
      <div
        className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--short`}
      ></div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "skeleton":
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={loadingClass} role="status" aria-label={text || "Cargando"}>
      {renderVariant()}
      {text && <span className={`${baseClass}__text`}>{text}</span>}
    </div>
  );
};

export default Loading;
