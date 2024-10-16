"use client";

import { aboutQuery } from "@/sanity/lib/queries";
import { LoadQueryResult } from "@/sanity/loader/loadQuery";
import { useQuery } from "@/sanity/loader/useQuery";
import { AboutPage } from "./AboutPage";

type AboutPagePreviewProps = {
  initial: LoadQueryResult<typeof aboutQuery>;
};

export const AboutPagePreview = (props: AboutPagePreviewProps) => {
  const { initial } = props;
  const { data } = useQuery(aboutQuery, {}, { initial });

  return <AboutPage data={data} />;
};
