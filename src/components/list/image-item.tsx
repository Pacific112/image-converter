import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fullscreen, LoaderIcon, Share, Upload, X } from "lucide-react";
import { ImageUploadProgress } from "@/components/list/types";

type Props = {
  image: ImageUploadProgress;
};

export const ImageItem = ({ image }: Props) => {
  return (
    <div className="relative aspect-square flex items-center justify-center">
      {image.status === "pending" ? (
        <LoaderIcon className="animate-spin" />
      ) : (
        <img
          src={image.url}
          alt={image.name}
          className="object-cover w-full h-full rounded-lg"
        />
      )}
      <div className="absolute top-2 rig"></div>
      <div className="absolute bottom-2 right-2 flex gap-2">
        {image.status === "completed" && (
          <button
            onClick={async (e) => {
              e.preventDefault();
              const res = await fetch(image.downloadUrl);
              const blob = await res.blob();

              const file = new File([blob], `${image.name}.jpg`, {
                type: blob.type,
              });
              if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
              }
            }}
            className="p-1 rounded-full bg-white"
          >
            <Share className="w-4 h-4" />
          </button>
        )}
        <Dialog key={image.id}>
          <DialogTrigger asChild>
            <button className="p-1 rounded-full bg-white">
              {image.status === "uploading" && (
                <Upload className="w-4 h-4 text-yellow-500" />
              )}
              {image.status === "completed" && (
                <Fullscreen className="w-4 h-4" />
              )}
              {image.status === "failed" && (
                <X className="w-4 h-4 text-red-500" />
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{image.name}</DialogTitle>
              <DialogDescription>Status: {image.status}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <img
                src={image.url}
                alt={image.name}
                className="w-full rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
