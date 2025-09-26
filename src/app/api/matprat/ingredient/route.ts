import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

const unit = v.nullable(
  v.object({
    name: v.string(),
    weight: v.number(),
  }),
);

const matpratIngredientSchema = v.object({
  name: v.string(),
  units: v.optional(
    v.object({
      liter: unit,
      tablespoon: unit,
      teaspoon: unit,
    }),
  ),
});

const matpratIngredientArray = v.array(matpratIngredientSchema);

const fetchIngredientsFromMatprat = async () => {
  const response = await fetch(
    "https://www.matprat.no/api/IngredientMeasurement/GetAllIngredients",
    {
      headers: {
        Referer: "https://www.matprat.no",
      },
      cache: "force-cache",
      next: {
        revalidate: 86400,
      },
    },
  );

  return v.parse(matpratIngredientArray, await response.json());
};

export async function GET(request: NextRequest) {
  const ingredientName = request.nextUrl.searchParams.get("name");

  const matpratIngredients = await fetchIngredientsFromMatprat();

  const ingredient = matpratIngredients.find(
    (i) => i.name.toLowerCase() === ingredientName,
  );

  if (!ingredient) {
    return notFound();
  }

  return NextResponse.json(ingredient);
}
