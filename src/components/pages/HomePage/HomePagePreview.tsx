"use client";

import { homePageQuery } from "@/sanity/lib/queries";
import { LoadQueryResult } from "@/sanity/loader/loadQuery";
import { useQuery } from "@/sanity/loader/useQuery";
import { HomePage } from "./HomePage";

type HomePagePreviewProps = {
  initial: LoadQueryResult<typeof homePageQuery>;
};

export const HomePagePreview = (props: HomePagePreviewProps) => {
  const { initial } = props;
  const { data } = useQuery(homePageQuery, {}, { initial });

  return <HomePage data={data} />;
};
