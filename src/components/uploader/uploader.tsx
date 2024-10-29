"use client";

import { ImageMetadata } from "@/components/list/types";
import { UploadDropzone } from "@/components/uploader/upload-dropzone";
import { ImagesList } from "@/components/list/images-list";
import { browserClient } from "@/lib/supabase/browser";
import { useState } from "react";

export const Uploader = ({ images }: { images: ImageMetadata[] }) => {
  const supabase = browserClient();
  const [images2, setImages2] = useState(images);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) return;

    // Create the optimistic entries first
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      status: "pending",
      url: URL.createObjectURL(file),
    })) satisfies ImageMetadata[];

    setImages2([...newFiles, ...images2]);

    await Promise.all(
      files.map(async (file, index) => {
        const ff = newFiles[index];
        try {
          await supabase.storage.from(userId).upload(ff.id, file);

          setImages2((i) =>
            i.map((ii) =>
              ii.id === ff.id ? { ...ff, status: "completed" } : ii,
            ),
          );
        } catch (error) {
          setImages2((i) =>
            i.map((ii) => (ii.id === ff.id ? { ...ff, status: "failed" } : ii)),
          );
        }
      }),
    );
  };

  return (
    <div className="space-y-4">
      <UploadDropzone onChange={handleFileChange} />
      {images2.length > 0 && <ImagesList images={images2} />}
    </div>
  );
};
