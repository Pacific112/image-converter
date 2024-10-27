"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagesList } from "@/components/list/images-list";
import { ImageMetadata } from "@/components/list/types";
import { UploadDropzone } from "@/components/uploader/upload-dropzone";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY || "",
);

const listImages = async (): Promise<ImageMetadata[]> => {
  const uploadedFiles = await supabase.storage
    .from("test-uploads")
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
      supabase.storage
        .from("test-uploads")
        .upload(imageMetadata.id, file)
        .then(() => console.log("done"));
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
