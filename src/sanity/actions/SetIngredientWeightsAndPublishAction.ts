import { useToast } from "@sanity/ui";
import { SanityDocument } from "next-sanity";
import { useEffect, useState } from "react";
import { DocumentActionComponent, useDocumentOperation } from "sanity";
import { Ingredient, IngredientWeights } from "../../../sanity.types";

const isIngredient = (draft: SanityDocument | null): draft is Ingredient => {
  return draft?._type === "ingredient";
};

export const SetIngredientWeightsAndPublishAction: DocumentActionComponent = (
  props,
) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const [isPublishing, setIsPublishing] = useState(false);
  const toast = useToast();

  const hasMatpratName =
    props.draft && isIngredient(props.draft) && props.draft.matpratName;

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false);
    }
  }, [props.draft, isPublishing]);

  return {
    disabled: publish.disabled !== false,
    label: isPublishing
      ? "Publishing…"
      : hasMatpratName
        ? "Publish & Update weights"
        : "Publish",
    onHandle: async () => {
      // This will update the button text
      setIsPublishing(true);

      if (hasMatpratName) {
        const response = await fetch(
          `/api/matprat/ingredient?name=${props.draft!.matpratName}`,
        );

        if (!response.ok) {
          toast.push({
            closable: true,
            status: "error",
            title: "Failed to fetch ingredient weights",
          });
        } else {
          const matpratIngredient = await response.json();

          const weights: IngredientWeights = {
            _type: "ingredientWeights",
            liter: matpratIngredient.units?.liter?.weight,
            tablespoon: matpratIngredient.units?.tablespoon?.weight,
            teaspoon: matpratIngredient.units?.teaspoon?.weight,
          };

          patch.execute([{ set: { weights: weights } }]);
        }
      }

      // Perform the publish
      publish.execute();

      // Signal that the action is completed
      props.onComplete();
    },
  };
};
