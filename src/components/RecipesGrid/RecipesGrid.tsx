import { RecipesListQueryResult } from "../../../sanity.types";
import { RecipesGridWrapper } from "./RecipesGridWrapper";
import { NoRecipes } from "./NoRecipes";
import { RecipesGridElement } from "./RecipesGridElement";

type RecipesGridProps = {
  recipes: RecipesListQueryResult;
};

export const RecipesGrid = ({ recipes }: RecipesGridProps) => {
  if (recipes.length === 0) {
    return <NoRecipes />;
  }

  return (
    <RecipesGridWrapper>
      {recipes.map((recipe, i) => {
        return (
          <RecipesGridElement
            key={recipe._id}
            recipe={recipe}
            prority={i < 3}
          />
        );
      })}
    </RecipesGridWrapper>
  );
};
