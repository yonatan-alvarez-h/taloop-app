import type { DatasetWithSamples } from "../types/dataset";
import { requestJson, requestNoContent } from "./api";

export interface DatasetCreateData {
  title: string;
  category: string;
  owner_id: string;
  visibility: "public" | "unlisted" | "private";
  publicPreviewEnabled: boolean;
  description?: string;
  tags?: string[];
  fields?: DatasetWithSamples["fields"];
}

export interface DatasetUpdateData {
  title?: string;
  category?: string;
  visibility?: "public" | "unlisted" | "private";
  status?: "draft" | "active" | "suspended" | "archived";
  publicPreviewEnabled?: boolean;
  description?: string;
  tags?: string[];
  fields?: DatasetWithSamples["fields"];
}

export interface DatasetPreviewResponse {
  datasetId: string;
  samples: Record<string, string | number | boolean | null>[];
  isLimited: boolean;
}

const normalizeDataset = (
  dataset: DatasetWithSamples & { id?: string; ownerId?: string }
): DatasetWithSamples => {
  const fields = (dataset.fields ?? []).map((field, index) => ({
    ...field,
    index: field.index ?? index + 1,
    description: field.description ?? "",
    nullable: field.nullable ?? true,
    unique: field.unique ?? false,
  }));

  return {
    ...dataset,
    _id: dataset._id ?? dataset.id ?? "",
    owner_id: dataset.owner_id ?? dataset.ownerId,
    tags: dataset.tags ?? [],
    description: dataset.description ?? "",
    fields,
    owner: dataset.owner ?? { name: "Owner no disponible", type: "individual" },
    priceUsd: dataset.priceUsd ?? 0,
    publicPreviewEnabled: dataset.publicPreviewEnabled ?? false,
    visibility: dataset.visibility ?? "public",
    status: dataset.status ?? "active",
    isLimited: dataset.isLimited,
    previewAvailable: dataset.previewAvailable,
  };
};

export async function fetchDatasets(): Promise<DatasetWithSamples[]> {
  const response = await requestJson<
    Array<DatasetWithSamples & { id?: string; ownerId?: string }>
  >("/datasets", {}, { authenticated: false });
  return response.map(normalizeDataset);
}

export async function fetchDatasetById(
  id: string
): Promise<DatasetWithSamples> {
  const response = await requestJson<
    DatasetWithSamples & { id?: string; ownerId?: string }
  >(`/datasets/${encodeURIComponent(id)}`);
  return normalizeDataset(response);
}

export async function fetchDatasetPreview(
  datasetId: string
): Promise<DatasetPreviewResponse> {
  return requestJson<DatasetPreviewResponse>(
    `/datasets/${encodeURIComponent(datasetId)}/preview`
  );
}

export async function createDataset(
  data: DatasetCreateData
): Promise<DatasetWithSamples> {
  const response = await requestJson<
    DatasetWithSamples & { id?: string; ownerId?: string }
  >("/datasets", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return normalizeDataset(response);
}

export async function updateDataset(
  datasetId: string,
  data: DatasetUpdateData
): Promise<DatasetWithSamples> {
  const response = await requestJson<
    DatasetWithSamples & { id?: string; ownerId?: string }
  >(`/datasets/${encodeURIComponent(datasetId)}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return normalizeDataset(response);
}

export async function archiveDataset(datasetId: string): Promise<void> {
  await requestNoContent(`/datasets/${encodeURIComponent(datasetId)}`, {
    method: "DELETE",
  });
}
