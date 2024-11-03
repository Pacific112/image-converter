type ImageStatus = "pending" | "completed" | "failed";

type BaseMetadata = {
  id: string;
  url: string;
  name: string;
};

type PendingMetadata = BaseMetadata & {
  status: "pending";
};

type CompletedMetadata = BaseMetadata & {
  downloadUrl: string;
  status: "completed";
};

type FailedMetadata = BaseMetadata & {
  status: "failed";
};

export type ImageMetadata =
  | PendingMetadata
  | CompletedMetadata
  | FailedMetadata;
