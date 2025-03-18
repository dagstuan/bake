import { draftMode } from "next/headers";
import { Suspense } from "react";
import { OptimisticSortOrderProps } from "./types";
import dynamic from "next/dynamic";

const OptimisticSortOrderClientWrapper = dynamic(
  () => import("./OptimisticSortOrderClientWrapper"),
);

/**
 * Optimistic sort ordering is only used when editing the website from Sanity Studio, so it's only actually loaded in Draft Mode.
 */

export async function OptimisticSortOrder(
  props: Omit<OptimisticSortOrderProps, "id"> & { id?: string | null },
) {
  const { children, id, path } = props;

  if (!id) {
    return children;
  }
  const { isEnabled } = await draftMode();
  if (!isEnabled) {
    return children;
  }

  return (
    <Suspense fallback={children}>
      <OptimisticSortOrderClientWrapper id={id} path={path}>
        {children}
      </OptimisticSortOrderClientWrapper>
    </Suspense>
  );
}
