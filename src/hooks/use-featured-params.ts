import {
  createSearchParamsCache,
  createSerializer,
  parseAsString,
  parseAsBoolean,
} from "nuqs/server";

//   export const seasonParams = {
//     season: parseAsString.withDefault(""),
//   };

//   export const seasonParamsCache = createSearchParamsCache(seasonParams);
//   export const serialize = createSerializer(seasonParams);

export const isFeaturedParams = {
  isFeatured: parseAsBoolean.withDefault(false),
};

export const featuredParamsCache = createSearchParamsCache(isFeaturedParams);
export const serialize = createSerializer(isFeaturedParams);
