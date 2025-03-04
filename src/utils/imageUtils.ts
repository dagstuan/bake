export const getImageDimensionsForAspectRatio = (
  imageWidth: number,
  aspectRatio: number,
): [number, number] => {
  const imageHeight = imageWidth * (1 / aspectRatio);
  return [Math.floor(imageWidth), Math.floor(imageHeight)];
};
