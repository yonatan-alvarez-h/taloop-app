export interface FavoriteList {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OffsetPage<T> {
  data: T[];
  limit: number;
  offset: number;
  next_offset: number | null;
}

export interface FavoriteListMembership {
  dataset_id: string;
  list_ids: string[];
}

export interface DatasetPublicResponse {
  _id: string;
  ownerId: string;
  title: string;
  category?: string;
  tags: string[];
  visibility: "public" | "unlisted" | "private";
  status: "draft" | "active" | "suspended" | "archived";
  publicPreviewEnabled: boolean;
}
