import { serverClient } from "@/lib/supabase/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await serverClient();
  const response = await supabase.auth.getUser();
  const user = response.data.user;
  if (!user) {
    throw new Error("User has to be logged in");
  }

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
  });

  return NextResponse.json(imagekit.getAuthenticationParameters());
}
