import { Thing, WithContext } from "schema-dts";

interface JsonLdProps<T extends Thing> {
  jsonLd: WithContext<T>;
}

export const JsonLd = <T extends Thing>(props: JsonLdProps<T>) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(props.jsonLd) }}
    />
  );
};
