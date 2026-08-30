import { AboutPage } from "@/components/pages/AboutPage/AboutPage";
import {
  getDynamicFetchOptions,
  sanityFetch,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { aboutQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Om bakdel",
};

export default async function Page() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicAbout />
      </Suspense>
    );
  }

  return <CachedAbout perspective="published" stega={false} />;
}

async function DynamicAbout() {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedAbout perspective={perspective} stega={stega} />;
}

async function CachedAbout({ perspective, stega }: DynamicFetchOptions) {
  "use cache";

  const initial = await sanityFetch({ query: aboutQuery, perspective, stega });

  return <AboutPage data={initial.data} />;
}
