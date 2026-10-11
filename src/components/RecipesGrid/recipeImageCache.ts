// The image file each clicked recipe card had loaded, keyed by slug. The
// recipe page skeleton shows it while the recipe streams in, so the browser
// can reuse the file it already has instead of showing an empty placeholder.
const recipeImageCache = new Map<string, string>();

export const cacheRecipeImage = (slug: string, src: string) => {
  recipeImageCache.set(slug, src);
};

export const getCachedRecipeImage = (slug: string) =>
  recipeImageCache.get(slug);
