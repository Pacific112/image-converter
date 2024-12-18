import { ImageUploadProgress } from "@/components/list/types";
import { ImageItem } from "@/components/list/image-item";

export const ImagesList = ({ images }: { images: ImageUploadProgress[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {images.map((image) => (
        <ImageItem key={image.id} image={image} />
      ))}
    </div>
  );
};
