import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageMetadata } from "@/components/list/types";
import { Uploader } from "@/components/uploader/uploader";
import { serverClient } from "@/lib/supabase/server";

const listImages = async (): Promise<ImageMetadata[]> => {
  const supabase = await serverClient();
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

  const urls = await supabase.storage
    .from(response.data.user.id)
    .createSignedUrls(
      uploadedFiles.data.map((f) => f.name),
      60,
    );
  if (urls.error) {
    throw urls.error;
  }

  return uploadedFiles.data.map((i) => {
    if (response.error) {
      throw response.error;
    }

    const u = urls.data.find((u) => u.path === i.name);
    return {
      id: i.id,
      name: i.name,
      status: "completed",
      url: u!.signedUrl,
    };
  });
};

export default async function MainCard() {
  const images = await listImages();

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
        <Uploader images={images} />
      </CardContent>
    </Card>
  );
}
