"use client";

import { ComponentProps, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { RecipeEditorContent } from "./RecipeEditorContent";
import { OmitStrict } from "@/utils/types";
import { RecipeIngredientsState } from "./recipeReducer";

type RecipeEditorProps = OmitStrict<
  ComponentProps<typeof RecipeEditorContent>,
  "onSave"
>;

export const RecipeEditor = ({ onChange, ...rest }: RecipeEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (
    servings: number,
    ingredients: RecipeIngredientsState,
  ) => {
    setIsOpen(false);
    onChange(servings, ingredients);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Rediger oppskrift</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <RecipeEditorContent
          {...rest}
          onChange={onChange}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};
