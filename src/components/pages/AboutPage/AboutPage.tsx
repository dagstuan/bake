import { TypographyH1 } from "@/components/Typography/TypographyH1";
import { AboutQueryResult } from "../../../../sanity.types";
import { PortableText } from "@/components/PortableText/PortableText";

interface AboutPageProps {
  data: AboutQueryResult;
}

export const AboutPage = (props: AboutPageProps) => {
  const { data: aboutContent } = props;

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
};
