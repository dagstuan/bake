import { PortableText } from "@/components/PortableText/PortableText";
import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { sanityFetch } from "@/sanity/lib/client";
import { aboutQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om bakdel",
};

export default async function Page() {
  const aboutContent = await sanityFetch({
    query: aboutQuery,
  });

  const body = aboutContent?.body;

  return (
    <div className="px-6">
      <div className="mx-auto mt-8 flex max-w-6xl flex-1 flex-col justify-center gap-12 sm:mt-16">
        <TypographyH1 className="mx-auto">{aboutContent?.title}</TypographyH1>

        <div className="mx-auto w-full max-w-2xl">
          {body && <PortableText value={body} />}
        </div>
      </div>
    </div>
  );
}
