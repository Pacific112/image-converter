"use client";

import { ImageMetadata } from "@/components/list/types";
import { UploadDropzone } from "@/components/uploader/upload-dropzone";
import { ImagesList } from "@/components/list/images-list";
import { browserClient } from "@/lib/supabase/browser";
import { useMemo, useState } from "react";
import ImageKit from "imagekit-javascript";

export const Uploader = ({
  images,
  authParams,
}: {
  images: ImageMetadata[];
  authParams: { token: string; expire: number; signature: string };
}) => {
  const imageKit = useMemo(
    () =>
      new ImageKit({
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      }),
    [],
  );
  const supabase = browserClient();
  const [images2, setImages2] = useState(images);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const heic2any = (await import("heic2any")).default;
    const files = Array.from(event.target.files || []);
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) return;

    // Create the optimistic entries first
    const newFiles = (await Promise.all(
      files.map(async (file) => {
        let blob = await heic2any({ blob: file });
        if (Array.isArray(blob)) {
          blob = blob[0];
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          status: "pending",
          url: URL.createObjectURL(blob),
        };
      }),
    )) satisfies ImageMetadata[];

    setImages2([...newFiles, ...images2]);

    await Promise.all(
      files.map(async (file, index) => {
        const ff = newFiles[index];
        try {
          await imageKit.upload({
            file,
            fileName: ff.name,
            isPrivateFile: true,
            token: authParams.token,
            signature: authParams.signature,
            expire: authParams.expire,
            tags: userResponse.data.user?.id,
          });

          setImages2((i) =>
            i.map((ii) =>
              // todo handle this!
              ii.id === ff.id
                ? { ...ff, downloadUrl: "", status: "completed" }
                : ii,
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
