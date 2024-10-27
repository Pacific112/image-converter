import { ImageMetadata } from "@/components/list/types";
import { ImageItem } from "@/components/list/image-item";

export const ImagesList = ({ images }: { images: ImageMetadata[] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((image) => (
        <ImageItem key={image.id} image={image} />
      ))}
    </div>
  );
};
