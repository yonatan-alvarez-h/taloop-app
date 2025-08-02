import type { DatasetWithSamples } from "../types/dataset";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export async function fetchDatasets(): Promise<DatasetWithSamples[]> {
  const res = await fetch(`${API_BASE}/datasets`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error("Error al obtener datasets");
  return res.json();
}

export async function fetchDatasetById(
  id: string
): Promise<DatasetWithSamples> {
  const res = await fetch(`${API_BASE}/datasets/${id}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error("Error al obtener dataset");
  return res.json();
}
