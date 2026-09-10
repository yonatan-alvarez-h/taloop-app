import React from "react";
import type { DatasetField } from "../../../../../../types/dataset";
import FieldsRow from "./FieldsRow";

interface FieldsTableProps {
  fields: DatasetField[];
  compact?: boolean;
}

const FieldsTable: React.FC<FieldsTableProps> = ({ fields, compact = false }) => {
  return (
    <table className="fields-table">
      <thead>
        <tr>
          {!compact && <th title="Índice de la columna en el dataset">#</th>}
          <th>Columna</th>
          <th>Tipo</th>
          <th>Descripción</th>
          {!compact && <th>Acepta Nulos</th>}
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <FieldsRow key={field.name} field={field} compact={compact} />
        ))}
      </tbody>
    </table>
  );
};

export default FieldsTable;
