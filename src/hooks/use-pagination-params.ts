import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
} from "nuqs/server";

export const renderingOptions = ["server", "client"] as const;
export type RenderingOptions = (typeof renderingOptions)[number];

export const paginationParams = {
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(8),
};

export const paginationParamsCache = createSearchParamsCache(paginationParams);
export const serialize = createSerializer(paginationParams);
