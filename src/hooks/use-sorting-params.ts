import {
  createSearchParamsCache,
  createSerializer,
  parseAsStringEnum,
} from "nuqs/server";

export const sortingOptions = ["acapella", "flow"] as const;
export type SortingOptions = (typeof sortingOptions)[number];

export const sortingOptionsArray = Array.from(sortingOptions);

export const sortParam = parseAsStringEnum<SortingOptions>(sortingOptionsArray);

export const sortingLabels: Record<SortingOptions, string> = {
  acapella: "აკაპელა",
  flow: "ფლოუ",
};

export const sortingParams = {
  sort: sortParam,
};

export const sortingParamsCache = createSearchParamsCache(sortingParams);
export const serialize = createSerializer(sortingParams);
