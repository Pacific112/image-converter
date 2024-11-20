"use client";

import { ImageUploadProgress } from "@/components/list/types";
import { UploadDropzone } from "@/components/uploader/upload-dropzone";
import { ImagesList } from "@/components/list/images-list";
import { browserClient } from "@/lib/supabase/browser";
import { useState } from "react";
import { uploadFile } from "@/components/uploader/upload-files";
import pLimit from "p-limit";

const limit = pLimit(5);

export const Uploader = ({
  initialImages,
}: {
  initialImages: ImageUploadProgress[];
}) => {
  const supabase = browserClient();
  const [images, setImages] = useState(initialImages);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    const userResponse = await supabase.auth.getUser();
    const user = userResponse.data.user;

    if (!user) return;

    const uploadProgresses = files.map((file) =>
      limit(async () => {
        for await (const fileStatusUpdate of uploadFile(file, user)) {
          switch (fileStatusUpdate.status) {
            case "pending":
              setImages((images) => [fileStatusUpdate, ...images]);
              break;
            case "failed":
            case "uploading":
            case "completed":
              setImages((images) =>
                images.map((image) =>
                  image.id === fileStatusUpdate.id
                    ? { ...image, ...fileStatusUpdate }
                    : image,
                ),
              );
              break;
          }
        }
      }),
    );

    await Promise.all(uploadProgresses);
  };

  return (
    <div className="space-y-4">
      <UploadDropzone onChange={handleFileChange} />
      {images.length > 0 && <ImagesList images={images} />}
    </div>
  );
};
