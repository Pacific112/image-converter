import { User } from "@supabase/auth-js";
import { uploadsClient } from "@/app/api/uploads/uploads-client";
import { imageKitBrowser } from "@/lib/imagekit/browser";
import { captureException } from "@sentry/core";

const generatePreview = async (file: File) => {
  const heic2any = (await import("heic2any")).default;
  let blob = await heic2any({ blob: file });

  if (Array.isArray(blob)) {
    blob = blob[0];
  }

  return blob;
};

type UploadFileState =
  | { id: string; name: string; status: "pending" }
  | { id: string; status: "failed" }
  | {
      id: string;
      status: "uploading";
      url: string;
    }
  | {
      id: string;
      status: "completed";
      url: string;
      downloadUrl: string;
    };

export async function* uploadFile(
  file: File,
  user: User,
): AsyncGenerator<UploadFileState> {
  const id = Math.random().toString(36).slice(2, 11);
  try {
    yield { id, name: file.name, status: "pending" };

    const preview = await generatePreview(file);
    const previewUrl = URL.createObjectURL(preview);
    yield { id, status: "uploading", url: previewUrl };

    const res = await imageKitBrowser.upload(file, user, file.name);

    const downloadUrlResponse = await uploadsClient.fetchDownloadUrl(res.name);
    const { downloadUrl } = await downloadUrlResponse.json();
    yield { id, status: "completed", url: previewUrl, downloadUrl };
  } catch (e) {
    captureException(e);
    yield { id, status: "failed" };
  }
}
