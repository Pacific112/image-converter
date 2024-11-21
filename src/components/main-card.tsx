import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadProgress } from "@/components/list/types";
import { Uploader } from "@/components/uploader/uploader";
import { serverClient } from "@/lib/supabase/server";
import ImageKit from "imagekit";
import { Controls } from "@/components/controls";
import { UserAvatar } from "@/components/header/user-avatar";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
});
const listImages = async (): Promise<ImageUploadProgress[]> => {
  const supabase = await serverClient();
  const response = await supabase.auth.getUser();
  const user = response.data.user;
  if (!user) {
    throw new Error("User has to be logged in");
  }

  const uploadedFiles = await imagekit.listFiles({
    path: `${user.id}/`,
    limit: 20,
  });

  return Promise.all(
    uploadedFiles.map(async (file) => {
      const url = imagekit.url({
        signed: true,
        expireSeconds: 3600,
        path: file.filePath,
      });
      const downloadUrl = imagekit.url({
        signed: true,
        expireSeconds: 3600,
        path: file.filePath,
        transformation: [{ format: "jpg" }],
      });

      return {
        id: file.fileId,
        name: file.name,
        status: "completed",
        url,
        downloadUrl,
      };
    }),
  );
};

export default async function MainCard() {
  const images = await listImages();

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold md:text-2xl">
          Image Converter for Anastasia
        </CardTitle>
        <UserAvatar />
      </CardHeader>
      <CardContent>
        <Uploader initialImages={images} />
      </CardContent>
      <Controls />
    </Card>
  );
}
