import React from "react";
import "./PreviewControls.css";

interface PreviewControlsProps {
  show: boolean;
  onToggle: () => void;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  show,
  onToggle,
}) => {
  return (
    <button className="dataset-preview-btn" onClick={onToggle}>
      {show ? "Ocultar vista previa" : "Ver vista previa"}
    </button>
  );
};

export default PreviewControls;
