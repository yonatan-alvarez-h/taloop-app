import React, { useState } from "react";
import "./DatasetUID.css";

interface DatasetUIDProps {
  uid: string;
}

const DatasetUID: React.FC<DatasetUIDProps> = ({ uid }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setShowPopup(true);

      // Hide popup after 2 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);

      // Reset copy state after 3 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="uid-container">
      <span className="uid-value">{uid}</span>
      <button
        className={`uid-copy-btn ${isCopied ? "copied" : ""}`}
        onClick={() => copyToClipboard(uid)}
        title={isCopied ? "¡Copiado!" : "Copiar UID"}
      >
        {/* Icono moderno SVG para copiar */}
        {isCopied ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </button>

      {/* Popup temporal */}
      {showPopup && (
        <div className="uid-popup">
          <div className="uid-popup-content">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            UID copiado correctamente
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetUID;
