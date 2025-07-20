import React, { useState } from "react";
import "./DatasetUID.css";

interface DatasetUIDProps {
  uid: string;
}

const DatasetUID: React.FC<DatasetUIDProps> = ({ uid }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
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
        title={isCopied ? "Copiado!" : "Copiar UID"}
      >
        {isCopied ? "✓" : "📋"}
      </button>
    </div>
  );
};

export default DatasetUID;
