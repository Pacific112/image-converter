type ImageStatus = "pending" | "completed" | "failed";

export type ImageMetadata = {
  id: string;
  url: string;
  name: string;
  status: ImageStatus;
};
