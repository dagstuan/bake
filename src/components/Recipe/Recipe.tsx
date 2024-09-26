"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import { useState } from "react";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference";
import { recipeIngredientReferenceType } from "@/sanity/schemaTypes/recipeIngredientReference";
import { PortableText } from "./PortableText";
import { Input } from "../ui/input";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import { TypographyH1 } from "../Typography/TypographyH1";

type RecipeProps = {
  recipe: RecipeQueryResult;
};

export const Recipe = ({ recipe }: RecipeProps) => {
  const {
    title,
    mainImage,
    servings,
    baseDryIngredients,
    instructions,
    ingredients,
  } = recipe ?? {};

  const initialServings = servings ?? 0;

  const [currentServings, setCurrentServings] = useState(initialServings);

  const servingsPercent = currentServings / initialServings;

  const currentSumDryIngredients = (baseDryIngredients ?? 0) * servingsPercent;

  return (
    <main className="prose prose-lg container mx-auto flex max-w-6xl flex-col gap-8 p-4 pt-12">
      {title ? (
        <TypographyH1 className="mb-12 text-center">{title}</TypographyH1>
      ) : null}
      {mainImage?.asset?._ref ? (
        <Image
          className="w-full rounded-lg"
          src={urlFor(mainImage?.asset?._ref).width(1000).height(400).url()}
          width={1000}
          height={400}
          alt={title || ""}
        />
      ) : null}
      <div className="grid grid-cols-1 gap-10 p-4 sm:grid-cols-12 sm:gap-4">
        <div className="col-span-full flex flex-col gap-4 sm:col-span-4">
          <div>
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              type="number"
              className="w-20"
              value={currentServings}
              onChange={(evt) => setCurrentServings(Number(evt.target.value))}
            />
          </div>

          {ingredients ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediens</TableHead>
                  <TableHead>Prosent</TableHead>
                  <TableHead>Mengde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map(({ _id, ingredient, percent, unit }) => {
                  const { name } = ingredient ?? {};
                  const percentNum = percent ?? 0;
                  const unitStr = unit ?? "g";

                  return (
                    <TableRow key={_id}>
                      <TableCell>{name}</TableCell>
                      <TableCell>{percent?.toFixed(2)}%</TableCell>
                      <TableCell>
                        {parseFloat(
                          (
                            currentSumDryIngredients *
                            (percentNum / 100)
                          ).toFixed(1),
                        )}{" "}
                        {unitStr}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : null}
        </div>
        <div className="col-span-full sm:col-span-8">
          {instructions ? (
            <PortableText
              value={instructions}
              types={{
                [recipeIngredientReferenceType.name]: ({ value }) => (
                  <RecipeIngredientReferenceResult
                    value={value}
                    sumDryIngredients={currentSumDryIngredients}
                  />
                ),
              }}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
};
