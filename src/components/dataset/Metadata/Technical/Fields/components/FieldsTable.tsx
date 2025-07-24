import React from "react";
import type { DatasetField } from "../../../../../../types/dataset";
import FieldsRow from "./FieldsRow";

interface FieldsTableProps {
  fields: DatasetField[];
}

const FieldsTable: React.FC<FieldsTableProps> = ({ fields }) => {
  return (
    <table className="fields-table">
      <thead>
        <tr>
          <th title="Índice de la columna en el dataset">#</th>
          <th>Columna</th>
          <th>Tipo</th>
          <th>Descripción</th>
          <th>Acepta Nulos</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <FieldsRow key={field.name} field={field} />
        ))}
      </tbody>
    </table>
  );
};

export default FieldsTable;
