type BaseProgress = {
  id: string;
  name: string;
};

type Pending = BaseProgress & {
  status: "pending";
  url?: string;
};

type Uploading = BaseProgress & {
  status: "uploading";
  url: string;
};

type Completed = BaseProgress & {
  url: string;
  downloadUrl: string;
  status: "completed";
};

type Failed = BaseProgress & {
  url: string;
  status: "failed";
};

export type ImageUploadProgress = Pending | Uploading | Completed | Failed;
