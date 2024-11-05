import { serverClient } from "@/lib/supabase/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await serverClient();
  const response = await supabase.auth.getUser();
  const user = response.data.user;
  if (!user) {
    throw new Error("User has to be logged in");
  }

  const { id } = await params;

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
  });

  const downloadUrl = imagekit.url({
    signed: true,
    expireSeconds: 3600,
    path: id,
    transformation: [{ format: "jpg" }],
  });

  return NextResponse.json({
    downloadUrl: `${downloadUrl}&ik-attachment=true`,
  });
}
