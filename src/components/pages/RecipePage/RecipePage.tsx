import { notFound } from "next/navigation";

import { Recipe } from "@/components/Recipe/Recipe";
import { urlForImage } from "@/sanity/lib/utils";
import type { Recipe as RecipeSchema, WithContext } from "schema-dts";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { formatDurationISO } from "@/utils/recipeUtils";
import { RecipeQueryResult } from "../../../../sanity.types";
import { creator, siteUrl } from "@/app/shared-metadata";

interface RecipePageProps {
  params: { slug: string };
  data: RecipeQueryResult | null;
}

const extractIngredients = (
  recipe: NonNullable<RecipeQueryResult>,
): string[] => {
  const ingredients: string[] = [];

  recipe.ingredients?.forEach((item) => {
    if (item._type === "reference" && item.ingredient) {
      const ing = item.ingredient;
      let text = "";

      if (ing._type === "ingredient" && ing.name) {
        // Format: amount unit ingredient (comment)
        if (item.percent && recipe.baseDryIngredients) {
          const amount = (item.percent / 100) * recipe.baseDryIngredients;
          text = `${Math.round(amount)} ${item.unit ?? "g"} ${ing.name}`;
        } else {
          text = ing.name;
        }

        if (item.comment) {
          text += ` (${item.comment})`;
        }

        ingredients.push(text);
      } else if (ing._type === "recipe" && ing.title) {
        ingredients.push(ing.title);
      }
    } else if (item._type === "ingredientGroup" && item.ingredients) {
      // Add ingredients from groups
      item.ingredients.forEach((groupIng) => {
        const ing = groupIng.ingredient;
        let text = "";

        if (ing?._type === "ingredient" && ing.name) {
          if (groupIng.percent && recipe.baseDryIngredients) {
            const amount = (groupIng.percent / 100) * recipe.baseDryIngredients;
            text = `${Math.round(amount)} ${groupIng.unit ?? "g"} ${ing.name}`;
          } else {
            text = ing.name;
          }

          if (groupIng.comment) {
            text += ` (${groupIng.comment})`;
          }

          ingredients.push(text);
        } else if (ing?._type === "recipe" && ing.title) {
          ingredients.push(ing.title);
        }
      });
    }
  });

  return ingredients;
};

export const RecipePage = (props: RecipePageProps) => {
  const { params, data: recipe } = props;

  if (!recipe) {
    return notFound();
  }

  const recipeIngredients = extractIngredients(recipe);

  const jsonLd: WithContext<RecipeSchema> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.seo?.metaTitle ?? recipe.title ?? "",
    description: recipe.seo?.metaDescription ?? "",
    url: `${siteUrl}/oppskrifter/${params.slug}`,
    datePublished: recipe._createdAt,
    author: {
      "@type": "Person",
      name: creator,
    },
    creator: {
      "@type": "Person",
      name: creator,
    },
    prepTime: recipe.activeTime
      ? formatDurationISO(recipe.activeTime)
      : undefined,
    cookTime: recipe.totalTime
      ? formatDurationISO(recipe.totalTime)
      : undefined,
    recipeCategory:
      recipe.categories?.map((category) => category.title).join(", ") ?? "",
    recipeYield: recipe.servings?.toString(),
    image: recipe.mainImage
      ? (urlForImage(recipe.mainImage)
          ?.width(800)
          .height(600)
          .fit("max")
          .dpr(1)
          .url() ?? "")
      : "",
    recipeIngredient:
      recipeIngredients.length > 0 ? recipeIngredients : undefined,
  };

  return (
    <>
      <Recipe recipe={recipe} slug={params.slug} />
      <JsonLd jsonLd={jsonLd} />
    </>
  );
};
