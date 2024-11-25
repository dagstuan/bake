import { Grid, Stack } from "@sanity/ui";
import { urlForImage } from "../lib/utils";
import Image from "next/image";
import { PreviewProps } from "sanity";
import { ImageGallery } from "../../../sanity.types";

type ImageGalleryPreviewProps = PreviewProps & {
  images: ImageGallery["images"];
  columns: ImageGallery["columns"];
};

const isImageGalleryPreviewProps = (
  props: PreviewProps,
): props is ImageGalleryPreviewProps => {
  return "images" in props && "columns" in props;
};

export default function ImageGalleryPreviewComponent(props: PreviewProps) {
  if (!isImageGalleryPreviewProps(props)) {
    return props.renderDefault(props);
  }

  const { images, schemaType, columns = 4 } = props;
  const schemaTitle = schemaType?.title;

  const modifiedProps = {
    ...props,
    title: schemaTitle,
  };

  return (
    <Stack space={[1]}>
      <>{props.renderDefault(modifiedProps)}</>
      <Grid columns={columns} gap={4}>
        {images?.map((image) => {
          if (!image.asset?._ref) {
            return null;
          }

          const url = urlForImage(image)
            ?.width(200)
            .height(200)
            .fit("max")
            .url();

          if (!url) {
            return null;
          }

          return (
            <div
              key={image.asset._ref}
              style={{ width: "100%", aspectRatio: "1/1" }}
            >
              <Image
                src={url}
                width={200}
                height={200}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt={image.alt ?? ""}
              />
            </div>
          );
        })}
      </Grid>
    </Stack>
  );
}
