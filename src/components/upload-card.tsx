"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagesList } from "@/components/list/images-list";
import { ImageMetadata } from "@/components/list/types";
import { UploadDropzone } from "@/components/uploader/upload-dropzone";
import { browserClient } from "@/lib/supabase/browser";

const listImages = async (): Promise<ImageMetadata[]> => {
  const supabase = browserClient();
  const response = await supabase.auth.getUser();
  if (!response.data.user) {
    throw new Error("User has to be logged in");
  }
  const uploadedFiles = await supabase.storage
    .from(response.data.user.id)
    .list("", { limit: 20 });
  if (uploadedFiles.error) {
    throw uploadedFiles.error;
  }

  return uploadedFiles.data.map((i) => {
    return {
      id: i.id,
      name: i.name,
      status: "completed",
      url: supabase.storage.from("test-uploads").getPublicUrl(i.name).data
        .publicUrl,
    };
  });
};

export default function UploadCard() {
  const supabase = browserClient();
  const [images, setImages] = useState<ImageMetadata[]>([]);
  useEffect(() => {
    listImages().then(setImages);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).map((file) => {
      let imageMetadata = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        status: "pending",
        url: URL.createObjectURL(file),
      } satisfies ImageMetadata;
      supabase.auth.getUser().then((user) => {
        if (user.data.user) {
          supabase.storage
            .from(user.data.user?.id)
            .upload(imageMetadata.id, file)
            .then(() => console.log("done"));
        }
      });
      return imageMetadata;
    });
    setImages([...images, ...newFiles]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl md:text-2xl font-bold">
          Image Converter for Anastasia
        </CardTitle>
        <Avatar>
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UploadDropzone onChange={handleFileChange} />
          {images.length > 0 && <ImagesList images={images} />}
        </div>
      </CardContent>
    </Card>
  );
}
