import { User } from "@supabase/auth-js";
import { uploadsClient } from "@/app/api/uploads/uploads-client";
import ImageKit from "imagekit-javascript";

const imageKit = new ImageKit({
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
});

const upload = async (file: File, user: User, name: string) => {
  const res = await uploadsClient.fetchAuthParams();
  const authParams = await res.json();
  return imageKit.upload({
    file,
    fileName: name,
    isPrivateFile: true,
    token: authParams.token,
    signature: authParams.signature,
    expire: authParams.expire,
    folder: user.id,
  });
};

export const imageKitBrowser = {
  upload,
};
