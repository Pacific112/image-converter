type ImageStatus = "pending" | "converting" | "completed" | "failed";

export type ImageMetadata = {
  id: string;
  url: string;
  name: string;
  status: ImageStatus;
};
