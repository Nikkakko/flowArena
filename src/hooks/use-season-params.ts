import {
  createSearchParamsCache,
  createSerializer,
  parseAsString,
} from "nuqs/server";

export const seasonParams = {
  season: parseAsString.withDefault(""),
};

export const seasonParamsCache = createSearchParamsCache(seasonParams);
export const serialize = createSerializer(seasonParams);
