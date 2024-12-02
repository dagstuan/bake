import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export const maxDuration = 60;
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export const generateStaticParams = () => {
  return [
    {
      tool: [""],
    },
    {
      tool: ["structure"],
    },
    {
      tool: ["presentation"],
    },
  ];
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
