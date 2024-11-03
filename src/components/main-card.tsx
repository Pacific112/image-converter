import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageMetadata } from "@/components/list/types";
import { Uploader } from "@/components/uploader/uploader";
import { serverClient } from "@/lib/supabase/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
});
const listImages = async (): Promise<ImageMetadata[]> => {
  const supabase = await serverClient();
  const response = await supabase.auth.getUser();
  const user = response.data.user;
  if (!user) {
    throw new Error("User has to be logged in");
  }

  const uploadedFiles = await imagekit.listFiles({ tags: user.id, limit: 20 });

  return Promise.all(
    uploadedFiles.map(async (file) => {
      const url = imagekit.url({
        signed: true,
        expireSeconds: 3600,
        path: file.filePath,
      });

      return {
        id: file.fileId,
        name: file.name,
        status: "completed",
        url,
      };
    }),
  );
};

export default async function MainCard() {
  const images = await listImages();
  const authParams = imagekit.getAuthenticationParameters();

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
        <Uploader images={images} authParams={authParams} />
      </CardContent>
    </Card>
  );
}
