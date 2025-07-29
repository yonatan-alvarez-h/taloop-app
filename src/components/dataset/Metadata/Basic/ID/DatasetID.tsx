import React, { useState } from "react";
import "./DatasetID.css";

interface DatasetIDProps {
  _id: string;
}

const DatasetID: React.FC<DatasetIDProps> = ({ _id }) => {
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
    <div className="id-container">
      <span className="id-value">{_id}</span>
      <button
        className={`id-copy-btn ${isCopied ? "copied" : ""}`}
        onClick={() => copyToClipboard(_id)}
        title={isCopied ? "¡Copiado!" : "Copiar ID"}
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
        <div className="id-popup">
          <div className="id-popup-content">
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
            ID copiado correctamente
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetID;
