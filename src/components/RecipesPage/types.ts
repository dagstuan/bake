import {
  categoryQueryParam,
  searchQueryParam,
} from "./Filters/RecipesFiltersContent";

export interface RecipesPageSearchParams {
  [searchQueryParam]?: string;
  [categoryQueryParam]?: string;
}
