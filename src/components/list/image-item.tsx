import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Check,
  Download,
  Image as ImageIcon,
  LoaderIcon,
  Upload,
  X,
} from "lucide-react";
import { ImageUploadProgress } from "@/components/list/types";

type Props = {
  image: ImageUploadProgress;
};

export const ImageItem = ({ image }: Props) => {
  return (
    <Dialog key={image.id}>
      <DialogTrigger asChild>
        <div className="relative aspect-square cursor-pointer flex items-center justify-center">
          {image.status === "pending" ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <img
              src={image.url}
              alt={image.name}
              className="object-cover w-full h-full rounded-lg"
            />
          )}
          {(image.status === "uploading" || image.status === "completed") && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex gap-2">
            {image.status === "completed" && (
              <a
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full bg-white"
                href={`${image.downloadUrl}`}
                download
              >
                <Download className="w-4 h-4" />
              </a>
            )}
            <div className="p-1 rounded-full bg-white">
              {image.status === "uploading" && (
                <Upload className="w-4 h-4 text-yellow-500" />
              )}
              {/*{image.status === "uploading" && (*/}
              {/*  <Progress value={66} className="w-4 h-4" />*/}
              {/*)}*/}
              {image.status === "completed" && (
                <Check className="w-4 h-4 text-green-500" />
              )}
              {image.status === "failed" && (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{image.name}</DialogTitle>
          <DialogDescription>Status: {image.status}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <img src={image.url} alt={image.name} className="w-full rounded-lg" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
