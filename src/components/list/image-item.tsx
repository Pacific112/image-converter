import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fullscreen, LoaderIcon, Upload, X } from "lucide-react";
import { ImageUploadProgress } from "@/components/list/types";
import { useSelectedFiles } from "@/store/selected-files.store";

type Props = {
  image: ImageUploadProgress;
};

export const ImageItem = ({ image }: Props) => {
  const { selectedFiles, toggleFileSelection } = useSelectedFiles();

  return (
    <label className="relative flex aspect-square cursor-pointer items-center justify-center">
      {image.status === "completed" ? (
        <input
          type="checkbox"
          className="absolute right-2 top-2"
          checked={selectedFiles.some((v) => v.id === image.id)}
          onChange={() => toggleFileSelection(image)}
        />
      ) : null}
      {image.status === "pending" ? (
        <LoaderIcon className="animate-spin" />
      ) : (
        <img
          src={image.url}
          alt={image.name}
          className="h-full w-full rounded-lg object-cover"
        />
      )}
      <div className="rig absolute top-2"></div>
      <div className="absolute bottom-2 right-2 flex gap-2">
        <Dialog key={image.id}>
          <DialogTrigger asChild>
            <button className="rounded-full bg-white p-1">
              {image.status === "uploading" && (
                <Upload className="h-4 w-4 text-yellow-500" />
              )}
              {image.status === "completed" && (
                <Fullscreen className="h-4 w-4" />
              )}
              {image.status === "failed" && (
                <X className="h-4 w-4 text-red-500" />
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
    </label>
  );
};
