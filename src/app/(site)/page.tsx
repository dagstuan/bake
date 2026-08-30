import { draftMode } from "next/headers";
import { Suspense } from "react";
import { HomePage } from "@/components/pages/HomePage/HomePage";
import {
  getDynamicFetchOptions,
  sanityFetch,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { homePageQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicHome />
      </Suspense>
    );
  }

  return <CachedHome perspective="published" stega={false} />;
}

async function DynamicHome() {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedHome perspective={perspective} stega={stega} />;
}

async function CachedHome({ perspective, stega }: DynamicFetchOptions) {
  "use cache";

  const initial = await sanityFetch({ query: homePageQuery, perspective, stega });

  return <HomePage data={initial.data} />;
}
